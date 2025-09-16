import styled, { css } from 'styled-components';
import { theme } from '../../styles/theme';

// Apple 스타일 Card 컴포넌트

const cardVariants = {
  default: css`
    background-color: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.light};
    box-shadow: ${theme.shadow.sm};

    &:hover {
      box-shadow: ${theme.shadow.md};
      transform: translateY(-2px);
    }
  `,

  elevated: css`
    background-color: ${theme.colors.background.primary};
    border: none;
    box-shadow: ${theme.shadow.lg};

    &:hover {
      box-shadow: ${theme.shadow.xl};
      transform: translateY(-2px);
    }
  `,

  outlined: css`
    background-color: ${theme.colors.background.primary};
    border: 1px solid ${theme.colors.border.medium};
    box-shadow: none;

    &:hover {
      border-color: ${theme.colors.border.dark};
      box-shadow: ${theme.shadow.sm};
    }
  `,

  ghost: css`
    background-color: transparent;
    border: none;
    box-shadow: none;

    &:hover {
      background-color: ${theme.colors.background.secondary};
    }
  `
};

const cardSizes = {
  sm: css`
    padding: ${theme.spacing[4]};
    border-radius: ${theme.borderRadius.lg};
  `,
  md: css`
    padding: ${theme.spacing[6]};
    border-radius: ${theme.borderRadius.xl};
  `,
  lg: css`
    padding: ${theme.spacing[8]};
    border-radius: ${theme.borderRadius['2xl']};
  `
};

export const Card = styled.div`
  transition: all ${theme.transition.base};
  position: relative;
  overflow: hidden;

  ${props => cardSizes[props.size || 'md']}
  ${props => cardVariants[props.variant || 'default']}

  ${props => props.interactive && css`
    cursor: pointer;
    user-select: none;

    &:active {
      transform: translateY(0);
      box-shadow: ${
        props.variant === 'elevated' ? theme.shadow.lg :
        props.variant === 'default' ? theme.shadow.sm :
        theme.shadow.sm
      };
    }
  `}

  ${props => props.disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  `}
`;

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[4]};

  ${props => props.noDivider === false && css`
    padding-bottom: ${theme.spacing[4]};
    border-bottom: 1px solid ${theme.colors.border.light};
  `}
`;

export const CardTitle = styled.h3`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin: 0;
  line-height: ${theme.typography.lineHeight.tight};
`;

export const CardSubtitle = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  margin: ${theme.spacing[1]} 0 0 0;
  line-height: ${theme.typography.lineHeight.normal};
`;

export const CardContent = styled.div`
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.relaxed};

  /* 마지막 요소의 마진 제거 */
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: ${theme.spacing[6]};
  gap: ${theme.spacing[3]};

  ${props => props.noDivider === false && css`
    padding-top: ${theme.spacing[4]};
    border-top: 1px solid ${theme.colors.border.light};
  `}

  ${props => props.align === 'center' && css`
    justify-content: center;
  `}

  ${props => props.align === 'end' && css`
    justify-content: flex-end;
  `}

  ${props => props.direction === 'column' && css`
    flex-direction: column;
    align-items: stretch;
  `}
`;

export const CardImage = styled.div`
  width: 100%;
  height: 200px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: ${theme.borderRadius.lg};
  margin-bottom: ${theme.spacing[4]};

  ${props => props.height && css`
    height: ${props.height};
  `}

  ${props => props.aspectRatio && css`
    height: auto;
    aspect-ratio: ${props.aspectRatio};
  `}
`;

// 특별한 Card 변형들
export const StatsCard = styled(Card)`
  text-align: center;

  .stats-number {
    font-size: ${theme.typography.fontSize['4xl']};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.primary[600]};
    margin-bottom: ${theme.spacing[2]};
  }

  .stats-label {
    font-size: ${theme.typography.fontSize.sm};
    color: ${theme.colors.text.secondary};
    text-transform: uppercase;
    letter-spacing: ${theme.typography.letterSpacing.wide};
  }
`;

export const FeatureCard = styled(Card)`
  text-align: center;

  .feature-icon {
    width: 48px;
    height: 48px;
    margin: 0 auto ${theme.spacing[4]} auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.primary[100]};
    color: ${theme.colors.primary[600]};
    border-radius: ${theme.borderRadius.full};

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const TestimonialCard = styled(Card)`
  .testimonial-content {
    font-style: italic;
    margin-bottom: ${theme.spacing[4]};
    position: relative;

    &::before {
      content: '"';
      font-size: ${theme.typography.fontSize['4xl']};
      color: ${theme.colors.primary[300]};
      position: absolute;
      left: -${theme.spacing[2]};
      top: -${theme.spacing[2]};
      line-height: 1;
    }
  }

  .testimonial-author {
    display: flex;
    align-items: center;
    gap: ${theme.spacing[3]};

    .author-avatar {
      width: 40px;
      height: 40px;
      border-radius: ${theme.borderRadius.full};
      background-color: ${theme.colors.background.tertiary};
    }

    .author-info {
      .author-name {
        font-weight: ${theme.typography.fontWeight.semibold};
        color: ${theme.colors.text.primary};
      }

      .author-title {
        font-size: ${theme.typography.fontSize.sm};
        color: ${theme.colors.text.secondary};
      }
    }
  }
`;

// Card 컨테이너들
export const CardGrid = styled.div`
  display: grid;
  gap: ${theme.spacing[6]};
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));

  ${props => props.columns && css`
    grid-template-columns: repeat(${props.columns}, 1fr);
  `}

  @media (max-width: ${theme.breakpoints.md}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing[4]};
  }
`;

export const CardStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[4]};

  ${props => props.spacing === 'tight' && css`
    gap: ${theme.spacing[2]};
  `}

  ${props => props.spacing === 'loose' && css`
    gap: ${theme.spacing[8]};
  `}
`;

export default Card;