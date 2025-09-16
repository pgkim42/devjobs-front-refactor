import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

// Apple 스타일 Button 컴포넌트

const buttonSizes = {
  sm: css`
    padding: ${theme.spacing[2]} ${theme.spacing[4]};
    font-size: ${theme.typography.fontSize.sm};
    min-height: 32px;
  `,
  md: css`
    padding: ${theme.spacing[3]} ${theme.spacing[6]};
    font-size: ${theme.typography.fontSize.base};
    min-height: 40px;
  `,
  lg: css`
    padding: ${theme.spacing[4]} ${theme.spacing[8]};
    font-size: ${theme.typography.fontSize.lg};
    min-height: 48px;
  `,
  xl: css`
    padding: ${theme.spacing[5]} ${theme.spacing[10]};
    font-size: ${theme.typography.fontSize.xl};
    min-height: 56px;
  `
};

const buttonVariants = {
  primary: css`
    background-color: ${theme.colors.primary[600]};
    color: ${theme.colors.text.inverse};
    border: 1px solid ${theme.colors.primary[600]};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
      transform: translateY(-1px);
      box-shadow: ${theme.shadow.md};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primary[800]};
      border-color: ${theme.colors.primary[800]};
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      ring: 2px solid ${theme.colors.primary[500]};
      ring-offset: 2px;
      box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
    }
  `,

  secondary: css`
    background-color: ${theme.colors.background.primary};
    color: ${theme.colors.text.primary};
    border: 1px solid ${theme.colors.border.medium};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.background.secondary};
      border-color: ${theme.colors.border.dark};
      transform: translateY(-1px);
      box-shadow: ${theme.shadow.md};
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.background.tertiary};
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
    }
  `,

  outline: css`
    background-color: transparent;
    color: ${theme.colors.primary[600]};
    border: 1px solid ${theme.colors.primary[600]};

    &:hover:not(:disabled) {
      background-color: ${theme.colors.primary[50]};
      color: ${theme.colors.primary[700]};
      border-color: ${theme.colors.primary[700]};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.primary[100]};
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
    }
  `,

  ghost: css`
    background-color: transparent;
    color: ${theme.colors.text.primary};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background-color: ${theme.colors.background.secondary};
      transform: translateY(-1px);
    }

    &:active:not(:disabled) {
      background-color: ${theme.colors.background.tertiary};
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px ${theme.colors.primary[200]};
    }
  `,

  danger: css`
    background-color: ${theme.colors.error};
    color: ${theme.colors.text.inverse};
    border: 1px solid ${theme.colors.error};

    &:hover:not(:disabled) {
      background-color: #ef4444;
      border-color: #ef4444;
      transform: translateY(-1px);
      box-shadow: ${theme.shadow.md};
    }

    &:active:not(:disabled) {
      background-color: #dc2626;
      border-color: #dc2626;
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px #fecaca;
    }
  `,

  success: css`
    background-color: ${theme.colors.success};
    color: ${theme.colors.text.inverse};
    border: 1px solid ${theme.colors.success};

    &:hover:not(:disabled) {
      background-color: #10b981;
      border-color: #10b981;
      transform: translateY(-1px);
      box-shadow: ${theme.shadow.md};
    }

    &:active:not(:disabled) {
      background-color: #059669;
      border-color: #059669;
      transform: translateY(0);
    }

    &:focus:not(:disabled) {
      outline: none;
      box-shadow: 0 0 0 2px #a7f3d0;
    }
  `
};

export const Button = styled.button`
  /* Base styles */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transition.fast};
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  /* Size variants */
  ${props => buttonSizes[props.size || 'md']}

  /* Color variants */
  ${props => buttonVariants[props.variant || 'primary']}

  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}

  /* Loading state */
  ${props => props.loading && css`
    pointer-events: none;
    opacity: 0.7;
  `}

  /* Disabled state */
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  /* Icon spacing */
  svg {
    width: 1em;
    height: 1em;
  }

  /* Icon with text spacing */
  svg:first-child:not(:last-child) {
    margin-right: ${theme.spacing[2]};
  }

  svg:last-child:not(:first-child) {
    margin-left: ${theme.spacing[2]};
  }

  /* Only icon (no text) */
  ${props => props.iconOnly && css`
    padding: ${buttonSizes[props.size || 'md'].includes('padding: 12px 24px') ? '12px' :
              buttonSizes[props.size || 'md'].includes('padding: 8px 16px') ? '8px' :
              buttonSizes[props.size || 'md'].includes('padding: 16px 32px') ? '16px' : '20px'};
    aspect-ratio: 1;
  `}
`;

// Icon Button (정사각형)
export const IconButton = styled(Button)`
  padding: ${props =>
    props.size === 'sm' ? theme.spacing[2] :
    props.size === 'lg' ? theme.spacing[4] :
    props.size === 'xl' ? theme.spacing[5] :
    theme.spacing[3]
  };
  aspect-ratio: 1;
  min-width: auto;
`;

// Link styled as Button
export const ButtonLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: ${theme.typography.fontFamily.primary};
  font-weight: ${theme.typography.fontWeight.medium};
  border-radius: ${theme.borderRadius.lg};
  transition: all ${theme.transition.fast};
  cursor: pointer;
  text-decoration: none;
  user-select: none;
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  border: none;

  ${props => buttonSizes[props.size || 'md']}
  ${props => buttonVariants[props.variant || 'primary']}

  ${props => props.fullWidth && css`
    width: 100%;
  `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  svg {
    width: 1em;
    height: 1em;
  }

  svg:first-child:not(:last-child) {
    margin-right: ${theme.spacing[2]};
  }

  svg:last-child:not(:first-child) {
    margin-left: ${theme.spacing[2]};
  }
`;

// Button Group
export const ButtonGroup = styled.div`
  display: inline-flex;
  border-radius: ${theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${theme.shadow.sm};

  ${Button}, ${ButtonLink} {
    border-radius: 0;
    margin: 0;

    &:not(:last-child) {
      border-right: 1px solid ${theme.colors.border.light};
    }

    &:first-child {
      border-top-left-radius: ${theme.borderRadius.lg};
      border-bottom-left-radius: ${theme.borderRadius.lg};
    }

    &:last-child {
      border-top-right-radius: ${theme.borderRadius.lg};
      border-bottom-right-radius: ${theme.borderRadius.lg};
    }
  }
`;

export default Button;