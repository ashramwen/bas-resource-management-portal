import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { BRLocationListViewService } from './list-view.service';
import { Location } from '../../../../shared/models/location.interface';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { LocationService } from '../../../../shared/providers/resource-services/location.service';
import {
  JsonEditorOptions,
  JsonEditorComponent
} from 'ng2-jsoneditor';

@Component({
  selector: 'br-location-editor',
  template: `
    <form [formGroup]="editorForm">
      <p class="location-id">当前节点ID: {{location?.location || ''}}</p>
      <table full-width>
        <tbody>
          <tr>
            <td>
              <md-input-container full-width>
                <input mdInput placeholder="父节点" 
                  [value]="(parentLocation | location | async) || '无'" 
                  [disabled]="true"
                />
              </md-input-container>
            </td>
            <td>
              <md-input-container full-width>
                <input mdInput 
                  placeholder="中文名称" 
                  formControlName="displayNameCN"
                />
              </md-input-container>
            </td>
            <td>
              <md-input-container full-width>
                <input mdInput 
                  placeholder="英文名称" 
                  formControlName="displayNameEN"
                />
              </md-input-container>
            </td>
          </tr>
        </tbody>
      </table>
      <md-tab-group>
        <md-tab label="地图">
          <p class="map-container">
            <bm-map-view [locations]="location? [location]: []"></bm-map-view>
          </p>
        </md-tab>
        <md-tab label="数据">
          <json-editor [options]="editorOptions"></json-editor>
        </md-tab>
      </md-tab-group>
    </form>
  `,
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
  `]
})
export class BRLocationEditorCmp implements OnInit {

  public editorForm: FormGroup;
  public editorOptions;

  public get geos() {
    return this._listViewService.currentLocation ?
      this._listViewService.currentLocation.geos : [];
  }

  @ViewChild(JsonEditorComponent)
  public jsonEditor: JsonEditorComponent;

  public get location(): Location {
    return this._listViewService.currentLocation;
  }

  public get parentLocation(): string {
    return !this._listViewService.currentLocation ? '' :
      (this._listViewService.currentLocation.parent ?
        this._listViewService.currentLocation.parent.location :
        '');
  }

  constructor(
    private _listViewService: BRLocationListViewService,
    private _formBuilder: FormBuilder,
    private _locationService: LocationService,
  ) { }

  public ngOnInit() {
    this.editorForm = this._formBuilder.group({
      displayNameCN: new FormControl(''),
      displayNameEN: new FormControl(''),
    });

    this._listViewService.currentLocationChanged.subscribe((location: Location) => {
      let value = Object.assign({},
        this.editorForm.value,
        { displayNameCN: location.displayNameCN },
        { displayNameEN: location.displayNameCN }
      );
      this.editorForm.setValue(value);
      this.jsonEditor.set(this.geos as any);
    });
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
  }
}
