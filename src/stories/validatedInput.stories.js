import ValidatedInput from '../base_components/forms/validatedInput.svelte';


export default {
  title: 'Base/Forms/ValidatedInput',
  component: ValidatedInput,
  argTypes: {
    label: { control: 'text' },
    addLabelClass: { control: 'text' },
    validateAs : {
        control: { type: 'select' },
        options: [
            'email', 
            'required', 
            'comparison',
            'password',
            'none'
        ],
    },
    passwordValidationOption : {
        control: { type: 'select' },
        options: [
            'default',
            'strong',
            'relaxed'
        ]
    }
  },
};

const Template = (args) => ({
  Component: ValidatedInput,
  props: args,
});

export const Default = Template.bind({});
Default.args = {
};

export const CustomLabel = Template.bind({});
CustomLabel.args = {
    label: 'Custom Label',
};

export const CustomPlaceholder = Template.bind({});
CustomPlaceholder.args = {
    placeholder: 'Custom Placeholder',
};

export const ValidatedValid = Template.bind({});
ValidatedValid.args = {
    isValidated: true,
    isValid: true
};

export const ValidatedInvalid = Template.bind({});
ValidatedInvalid.args = {
    isValidated: true,
    isValid: false
};

export const ValidatedInvalidWithMessage = Template.bind({});
ValidatedInvalidWithMessage.args = {
    isValidated: true,
    isValid: false,
    validationMessage: 'Custom Message!'
};

export const ValidateEmail = Template.bind({});
ValidateEmail.args = {
    isValidated: true,
    validateAs: 'email'
};

export const ValidateRequired = Template.bind({});
ValidateRequired.args = {
    isValidated: true,
    validateAs: 'required'
};

export const ValidateComparison = Template.bind({});
ValidateComparison.args = {
    isValidated: true,
    validateAs: 'comparison',
    compareValue: 'compare'
};

export const ValidatePassword = Template.bind({});
ValidatePassword.args = {
    isValidated: true,
    validateAs: 'password'
};

export const ValidatePasswordDefault = Template.bind({});
ValidatePasswordDefault.args = {
    isValidated: true,
    validateAs: 'password',
    passwordValidationOption: 'default'
};

export const ValidatePasswordStrong = Template.bind({});
ValidatePasswordStrong.args = {
    isValidated: true,
    validateAs: 'password',
    passwordValidationOption: 'strong'
};

export const ValidatePasswordRelaxed = Template.bind({});
ValidatePasswordRelaxed.args = {
    isValidated: true,
    validateAs: 'password',
    passwordValidationOption: 'relaxed'
};

export const TypeDate = Template.bind({});
TypeDate.args = {
    type: 'date'
};

export const TypeNumber = Template.bind({});
TypeNumber.args = {
    type: 'number'
};

