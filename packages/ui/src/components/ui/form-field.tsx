import * as React from 'react';
import { cn } from '../../lib/utils';
import {
  formFieldVerticalClasses,
  formFieldHorizontalClasses,
  helperTextClasses,
  errorMessageClasses,
} from './form-field.styles';

/**
 * Compound 컨테이너. `<Label>`, `<Input>`, `<HelperText>`, `<ErrorMessage>` 를 자식으로 조립.
 * orientation="vertical" (기본) 또는 "horizontal" (체크박스 + 라벨 조합용).
 */
export interface FormFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'vertical' | 'horizontal';
}

export const FormField = React.forwardRef<HTMLDivElement, FormFieldProps>(
  ({ className, orientation = 'vertical', ...props }, ref) => (
    <div
      ref={ref}
      data-orientation={orientation}
      className={cn(
        orientation === 'vertical' ? formFieldVerticalClasses : formFieldHorizontalClasses,
        className,
      )}
      {...props}
    />
  ),
);
FormField.displayName = 'FormField';

export const HelperText = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn(helperTextClasses, className)} {...props} />
  ),
);
HelperText.displayName = 'HelperText';

export const ErrorMessage = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    if (!children) return null;
    return (
      <p
        ref={ref}
        role="alert"
        className={cn(errorMessageClasses, className)}
        {...props}
      >
        {children}
      </p>
    );
  },
);
ErrorMessage.displayName = 'ErrorMessage';
