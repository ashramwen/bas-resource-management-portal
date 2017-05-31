import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { MdDialog } from '@angular/material';

import { BRLocationListViewService } from './list-view.service';
import { Location } from '../../../../shared/models/location.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LocationService } from '../../../../shared/providers/resource-services/location.service';
import { AppUtils } from '../../../../shared/utils/app-utils';
import { BRAddSubLocationCmp } from './add-sublocation.component';
import { BMImage } from '../../../../shared/components/map-view/models/image.interface';
import {
  StatusTreeNode
} from '../../../../shared/components/status-tree/status-tree-node.interface';
import {
  JsonEditorOptions,
  JsonEditorComponent
} from 'ng2-jsoneditor';

@Component({
  selector: 'br-location-editor',
  templateUrl: './location-editor.component.html',
  styles: [`
    form {
      width: 100%;
    }
    p.location-id {
      font-size: 13px;
    }
    p.map-container {
      height: 200px;
    }
    .img-preview {
      margin: 14px 10px;
      width: 26px;
      height: 26px;
    }
  `]
})
export class BRLocationEditorCmp implements OnInit {

  public editorForm: FormGroup;
  public editorOptions: JsonEditorOptions;
  public currentLocation: Location;
  public previewImageUrl: string = '';
  public imageLayers: BMImage[] = [];

  public get mapLocationInput() {
    return this.currentLocation ? [this.currentLocation] : [];
  }

  public get geos() {
    return this._listViewService.currentLocation ?
      this._listViewService.currentLocation.geos : [];
  }

  @ViewChild(JsonEditorComponent)
  public jsonEditor: JsonEditorComponent;

  public get parentLocation(): string {
    return !this._listViewService.currentLocation ? '' :
      (this._listViewService.currentLocation.parent ?
        this._listViewService.currentLocation.parent.location :
        '');
  }

  public get subNodes(): Array< StatusTreeNode<Location> >{
    return this._listViewService.currentNode ?
      (this._listViewService.currentNode.children || []) : [];
  }

  private _locationGeoInput: string = '';

  constructor(
    private _listViewService: BRLocationListViewService,
    private _formBuilder: FormBuilder,
    private _locationService: LocationService,
    private _modal: MdDialog
  ) { }

  public ngOnInit() {
    this.editorForm = this._formBuilder.group({
      displayNameCN: new FormControl(''),
      displayNameEN: new FormControl(''),
      layerImage: new FormControl('')
    });

    this._listViewService.currentNodeChanged.subscribe(() => {
      if (this._listViewService.currentLocation) {
        this.editorForm.enable();
      } else {
        this.editorForm.disable();
        return;
      }
      this.currentLocation = new Location();
      Object.assign(this.currentLocation, this._listViewService.currentLocation);
      this._locationDataInit();
      this.tabChanged();
    });
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
    this.editorOptions.onChange = () => {
      this._locationGeoInput = this.jsonEditor.getText();

      if (this._locationGeoInput && AppUtils.validateJson(this._locationGeoInput)) {
        this.currentLocation.geoPolygon = this._locationGeoInput;
      }
    };

    this.editorForm.controls['layerImage'].valueChanges
      .debounceTime(300)
      .subscribe(async (value: string) => {
        let result = await this._testImage(value);
        if (result) {
          this.previewImageUrl = value;
          let geos = [];
          if (this.currentLocation && this.currentLocation.geos) {
            geos = this.currentLocation.geos.reduce((points, geo) => points.concat(geo), []);
          }
          this.imageLayers = [{
            imageUrl: value,
            geos: AppUtils.findBounds(geos)
          }];
        } else {
          this.previewImageUrl = '';
          this.imageLayers = [];
        }
        console.log(result);
      });
  }

  public tabChanged() {
    this._locationDataInit();
    this.jsonEditor.set(this.geos as any);
  }

  public selectNode(node: StatusTreeNode<Location>) {
    this._listViewService.currentNode = node;
  }

  public addSubLocation() {
    let modal = this._modal.open(BRAddSubLocationCmp, {
      data: this.currentLocation,
    });
    modal.afterClosed().subscribe((result) => {
      console.log(result);
    });
  }

  private _locationDataInit() {
    if (!this.currentLocation) { return; }
    let value = Object.assign({},
      this.editorForm.value,
      { displayNameCN: this.currentLocation.displayNameCN || '' },
      { displayNameEN: this.currentLocation.displayNameCN || '' },
      { layerImage: '' }
    );
    this.editorForm.setValue(value);
  }

  private _testImage(url: string, timeout = 5000) {
    let img = new Image();
    let timedOut = false;

    return new Promise((resolve, reject) => {
      let timer = setTimeout(() => {
        timedOut = true;
        // reset .src to invalid URL so it stops previous
        // loading, but doesn't trigger new load
        img.src = '';
        resolve(false);
      }, timeout);
      img.onerror = img.onabort = function () {
        if (!timedOut) {
          clearTimeout(timer);
          resolve(false);
        }
      };
      img.onload = () => {
        if (!timedOut) {
          clearTimeout(timer);
        }
        resolve(true);
      };
      img.src = url;
    });
  }

}
