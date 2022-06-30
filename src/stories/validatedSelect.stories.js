import ValidatedSelectInput from '../base_components/forms/validatedSelectInput.svelte';


export default {
  title: 'Base/Forms/ValidatedSelectInput',
  component: ValidatedSelectInput,
  argTypes: {
    label: { control: 'text' },
    addLabelClass: { control: 'text' },
  },
};

const Template = (args) => ({
  Component: ValidatedSelectInput,
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

export const CustomValues = Template.bind({});
CustomValues.args = {
    values: {
      defaultValue: { notSelected: "Choose one" },
      options: [
        'Option 1',
        'Option 2'
      ]
    }
};
