import styled from 'styled-components';
import { theme } from '../../styles/theme';

// Apple 스타일 Typography 컴포넌트들

export const Heading1 = styled.h1`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize['5xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  line-height: ${theme.typography.lineHeight.tight};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['4xl']};
  }
`;

export const Heading2 = styled.h2`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize['4xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.tight};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['3xl']};
  }
`;

export const Heading3 = styled.h3`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.tight};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['2xl']};
  }
`;

export const Heading4 = styled.h4`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

export const Heading5 = styled.h5`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const Heading6 = styled.h6`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  margin: 0;
`;

export const Body = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.base};
  font-weight: ${theme.typography.fontWeight.normal};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${props => props.secondary ? theme.colors.text.secondary : theme.colors.text.primary};
  margin: 0;
`;

export const BodyLarge = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.normal};
  line-height: ${theme.typography.lineHeight.relaxed};
  color: ${props => props.secondary ? theme.colors.text.secondary : theme.colors.text.primary};
  margin: 0;
`;

export const BodySmall = styled.p`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.normal};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${props => props.secondary ? theme.colors.text.tertiary : theme.colors.text.secondary};
  margin: 0;
`;

export const Caption = styled.span`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.normal};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.tertiary};
`;

export const Label = styled.label`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  line-height: ${theme.typography.lineHeight.normal};
  color: ${theme.colors.text.primary};
  display: block;
  margin-bottom: ${theme.spacing[2]};
`;

export const Link = styled.a`
  font-family: ${theme.typography.fontFamily.primary};
  color: ${theme.colors.primary[600]};
  text-decoration: none;
  font-weight: ${theme.typography.fontWeight.medium};
  transition: color ${theme.transition.fast};

  &:hover {
    color: ${theme.colors.primary[700]};
  }

  &:focus {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
  }
`;

// 디스플레이 텍스트 (특별한 경우)
export const Display = styled.h1`
  font-family: ${theme.typography.fontFamily.primary};
  font-size: ${theme.typography.fontSize['7xl']};
  font-weight: ${theme.typography.fontWeight.extrabold};
  line-height: 1;
  color: ${theme.colors.text.primary};
  letter-spacing: ${theme.typography.letterSpacing.tight};
  margin: 0;

  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: ${theme.typography.fontSize['6xl']};
  }

  @media (max-width: ${theme.breakpoints.md}) {
    font-size: ${theme.typography.fontSize['5xl']};
  }
`;

// 코드 텍스트
export const Code = styled.code`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.tertiary};
  padding: ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.borderRadius.base};
`;

export const Pre = styled.pre`
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.primary};
  background-color: ${theme.colors.background.tertiary};
  padding: ${theme.spacing[4]};
  border-radius: ${theme.borderRadius.lg};
  overflow-x: auto;
  line-height: ${theme.typography.lineHeight.relaxed};
`;