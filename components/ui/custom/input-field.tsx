import React from "react";
import { Label } from "../label";
import { Input } from "../input";
import { Controller, ControllerProps } from "react-hook-form";

type InputFieldProps = Readonly<{
  label: string;
  name: string;
  labelProps?: React.ComponentProps<typeof Label>;
  inputProps?: React.ComponentProps<typeof Input>;
  hookFormProps?: ControllerProps;
}>;

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  labelProps,
  inputProps,
  hookFormProps,
}) => {
  return (
    <div className="grid gap-y-2">
      <Label {...labelProps} htmlFor={name}>
        {label}
      </Label>
      {hookFormProps && (
        <Controller
          {...hookFormProps}
          render={({ field }) => <Input {...field} />}
        />
      )}
      {!hookFormProps && <Input {...inputProps} name={name} id={name} />}
    </div>
  );
};
InputField.displayName = "InputField";

export default InputField;
