import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

export type TextFieldSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-text-field',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './text-field.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TextFieldComponent),
      multi: true,
    },
  ],
})
export class TextFieldComponent implements ControlValueAccessor, Validator {
  @Input() label?: string;
  @Input() helperText?: string;
  @Input() error = false;
  @Input() size: TextFieldSize = 'md';
  @Input() prefix?: string;
  @Input() suffix?: string;
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() required = false;
  @Input() numberOnly = false;
  @Input() type: 'text' | 'password' | 'email' | 'number' = 'text';
  @Input() maxLength?: number;
  @Input() minLength?: number;
  @Input() pattern?: string;
  @Input() autocomplete?: string;
  @Input() readonly = false;

  @Output() valueChange = new EventEmitter<string>();
  @Output() blurEvent = new EventEmitter<FocusEvent>();
  @Output() focusEvent = new EventEmitter<FocusEvent>();

  value = '';
  focused = false;
  uniqueId = `text-field-${Math.random().toString(36).substr(2, 9)}`;

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  get inputType(): string {
    if (this.numberOnly) return 'number';
    return this.type;
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (this.required && !control.value) {
      return { required: true };
    }
    return null;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value = target.value;
    this.onChange(this.value);
    this.valueChange.emit(this.value);
  }

  onBlur(event: FocusEvent): void {
    this.focused = false;
    this.onTouched();
    this.blurEvent.emit(event);
  }

  onFocus(event: FocusEvent): void {
    this.focused = true;
    this.focusEvent.emit(event);
  }
}
