import { Output, EventEmitter } from '@angular/core';
import {
  Component,
  OnInit
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  ValidatorFn
} from '@angular/forms';

@Component({
  selector: 'password-change',
  templateUrl: './password-change.component.html',
  styleUrls: ['./password-change.component.scss']
})
export class PasswordChangeCmp implements OnInit {

  public passwordForm: FormGroup;
  public submitted: boolean = false;

  @Output()
  public close: EventEmitter<any> = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder
  ) { }

  public ngOnInit() {
    let currentPasswordControl = new FormControl('', [Validators.required]);
    let newPasswordControl = new FormControl('', [Validators.required]);
    let confirmPasswordControl = new FormControl('', []);

    newPasswordControl.valueChanges.subscribe(() => {
      confirmPasswordControl.setValue(confirmPasswordControl.value);
    });

    let passwordConfirmValidator: ValidatorFn =
      this.generatePasswordConfirmValidator(newPasswordControl, confirmPasswordControl);

    confirmPasswordControl.setValidators(passwordConfirmValidator);

    this.passwordForm = this.formBuilder.group({
      currentPassword: currentPasswordControl,
      newPassword: newPasswordControl,
      confirmPassword: confirmPasswordControl
    });
  }

  public submit() {
    this.submitted = true;
    if (this.passwordForm.invalid) {
      return;
    }
    this.close.emit();
  }

  private generatePasswordConfirmValidator(
    newPasswordControl: FormControl,
    confirmPasswordControl: FormControl
  ) {
    return (control: FormControl) => {
      return newPasswordControl.value === confirmPasswordControl.value ? {
        confirmed: null
      } : {
        confirmed: {
          valid: false
        }
      };
    };
  }
}
