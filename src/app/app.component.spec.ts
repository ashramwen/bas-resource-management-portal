import {
  ComponentFixture,
  TestBed,
  async,
  inject,
} from '@angular/core/testing';

// Load the implementations that should be tested
import { AppCmp } from './app.component';
import { AppState } from './app.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe(`App`, () => {
  let comp: AppCmp;
  let fixture: ComponentFixture<AppCmp>;

  // async beforeEach
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppCmp ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [AppState]
    })
    .compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(AppCmp);
    comp    = fixture.componentInstance;

    fixture.detectChanges(); // trigger initial data binding
  });

  it(`should be readly initialized`, () => {
    expect(fixture).toBeDefined();
    expect(comp).toBeDefined();
  });

  it(`should be @AngularClass`, () => {
    expect(comp.url).toEqual('https://twitter.com/AngularClass');
    // expect(comp.angularclassLogo).toEqual('assets/img/angularclass-avatar.png');
    // expect(comp.name).toEqual('Angular 2 Webpack Starter');
  });

  it('should log ngOnInit', () => {
    spyOn(console, 'log');
    expect(console.log).not.toHaveBeenCalled();

    comp.ngOnInit();
    expect(console.log).toHaveBeenCalled();
  });

});
