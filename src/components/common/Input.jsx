import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

// Apple 스타일 Input 컴포넌트들

const inputSizes = {
  sm: css`
    padding: ${theme.spacing[2]} ${theme.spacing[3]};
    font-size: ${theme.typography.fontSize.sm};
    min-height: 32px;
  `,
  md: css`
    padding: ${theme.spacing[3]} ${theme.spacing[4]};
    font-size: ${theme.typography.fontSize.base};
    min-height: 40px;
  `,
  lg: css`
    padding: ${theme.spacing[4]} ${theme.spacing[5]};
    font-size: ${theme.typography.fontSize.lg};
    min-height: 48px;
  `
};

const inputStates = {
  default: css`
    border: 1px solid ${theme.colors.border.medium};
    background-color: ${theme.colors.background.primary};

    &:hover:not(:disabled):not(:focus) {
      border-color: ${theme.colors.border.dark};
    }

    &:focus {
      outline: none;
      border-color: ${theme.colors.primary[500]};
      box-shadow: 0 0 0 3px ${theme.colors.primary[100]};
    }
  `,

  error: css`
    border: 1px solid ${theme.colors.error};
    background-color: ${theme.colors.background.primary};

    &:focus {
      outline: none;
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px #fecaca;
    }
  `,

  success: css`
    border: 1px solid ${theme.colors.success};
    background-color: ${theme.colors.background.primary};

    &:focus {
      outline: none;
      border-color: ${theme.colors.success};
      box-shadow: 0 0 0 3px #a7f3d0;
    }
  `,

  disabled: css`
    background-color: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border.light};
    color: ${theme.colors.text.tertiary};
    cursor: not-allowed;
  `
};

export const Input = styled.input`
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.normal};
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transition.fast};
  width: 100%;

  ${props => inputSizes[props.size || 'md']}
  ${props => inputStates[props.state || 'default']}

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  &:disabled {
    ${inputStates.disabled}
  }

  /* Auto-fill 스타일 개선 */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px ${theme.colors.background.primary} inset;
    -webkit-text-fill-color: ${theme.colors.text.primary};
  }
`;

export const Textarea = styled.textarea`
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.normal};
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transition.fast};
  width: 100%;
  resize: vertical;
  min-height: 100px;

  ${props => inputSizes[props.size || 'md']}
  ${props => inputStates[props.state || 'default']}

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }

  &:disabled {
    ${inputStates.disabled}
    resize: none;
  }
`;

export const Select = styled.select`
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.normal};
  color: ${theme.colors.text.primary};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transition.fast};
  width: 100%;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right ${theme.spacing[2]} center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: ${theme.spacing[10]};

  ${props => inputSizes[props.size || 'md']}
  ${props => inputStates[props.state || 'default']}

  &:disabled {
    ${inputStates.disabled}
    cursor: not-allowed;
  }

  /* Firefox에서 기본 화살표 제거 */
  -moz-appearance: none;

  /* WebKit 브라우저에서 기본 화살표 제거 */
  -webkit-appearance: none;
  appearance: none;
`;

// Input Container with Label and Helper Text
export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
  width: 100%;
`;

export const InputLabel = styled.label`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  display: block;

  ${props => props.required && css`
    &::after {
      content: ' *';
      color: ${theme.colors.error};
    }
  `}
`;

export const InputHelperText = styled.span`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xs};
  color: ${props =>
    props.error ? theme.colors.error :
    props.success ? theme.colors.success :
    theme.colors.text.tertiary
  };
  display: block;
`;

// Search Input with Icon
export const SearchInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const SearchInput = styled(Input)`
  padding-left: ${theme.spacing[10]};

  &::placeholder {
    color: ${theme.colors.text.tertiary};
  }
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: ${theme.spacing[3]};
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.tertiary};
  pointer-events: none;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// Input with Icon (general purpose)
export const InputWithIcon = styled.div`
  position: relative;
  width: 100%;

  ${Input}, ${Select} {
    ${props => props.iconPosition === 'left' && css`
      padding-left: ${theme.spacing[10]};
    `}

    ${props => props.iconPosition === 'right' && css`
      padding-right: ${theme.spacing[10]};
    `}
  }
`;

export const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.text.tertiary};
  pointer-events: none;

  ${props => props.position === 'left' && css`
    left: ${theme.spacing[3]};
  `}

  ${props => props.position === 'right' && css`
    right: ${theme.spacing[3]};
  `}

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
`;

// Checkbox & Radio
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 1rem;
  height: 1rem;
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.base};
  background-color: ${theme.colors.background.primary};
  cursor: pointer;
  transition: all ${theme.transition.fast};

  &:checked {
    background-color: ${theme.colors.primary[600]};
    border-color: ${theme.colors.primary[600]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
  }

  &:disabled {
    background-color: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border.light};
    cursor: not-allowed;
  }
`;

export const Radio = styled.input.attrs({ type: 'radio' })`
  width: 1rem;
  height: 1rem;
  border: 1px solid ${theme.colors.border.medium};
  border-radius: ${theme.borderRadius.full};
  background-color: ${theme.colors.background.primary};
  cursor: pointer;
  transition: all ${theme.transition.fast};

  &:checked {
    background-color: ${theme.colors.primary[600]};
    border-color: ${theme.colors.primary[600]};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
  }

  &:disabled {
    background-color: ${theme.colors.background.tertiary};
    border-color: ${theme.colors.border.light};
    cursor: not-allowed;
  }
`;

// Label for Checkbox/Radio
export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  cursor: pointer;
  user-select: none;

  &:hover ${Checkbox}, &:hover ${Radio} {
    border-color: ${theme.colors.border.dark};
  }
`;

export default Input;