/**
 * @component AIAnnotatedComponent
 * @description Example component demonstrating proper AI-friendly annotation format
 * 
 * @ai-context
 * - Serves as a reference implementation for AI-friendly documentation
 * - Demonstrates all required annotation tags
 * - Shows proper formatting and organization of documentation
 * - Acts as a simple UI component with platform-aware theming
 * 
 * @props
 * - title: Main heading text for the component
 * - description: Optional descriptive text to display
 * - platform: Platform identifier (ascender/neothinker/immortal)
 * - variant: Visual style variant (default/bordered/elevated)
 * - onAction: Optional callback when action button is clicked
 * 
 * @database
 * - profiles: Accessed for user platform preferences
 * - platform_customization: Used for platform-specific styling
 * 
 * @related
 * - components/ui/Card
 * - components/ui/Button
 * - hooks/useTheme
 * - lib/theme/ThemeProvider
 * 
 * @example
 * <AIAnnotatedComponent 
 *   title="Welcome to Neothink" 
 *   description="This is an example component"
 *   platform="ascender"
 *   variant="bordered"
 *   onAction={() => console.log('Action clicked')}
 * />
 */

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../lib/components/ui/card';
import { Button } from '../../../lib/components/ui/button';
import { useTheme } from '../../../lib/theme/ThemeProvider';

interface AIAnnotatedComponentProps {
  title: string;
  description?: string;
  platform?: 'ascender' | 'neothinker' | 'immortal';
  variant?: 'default' | 'bordered' | 'elevated';
  onAction?: () => void;
}

export const AIAnnotatedComponent: React.FC<AIAnnotatedComponentProps> = ({
  title,
  description,
  platform = 'ascender',
  variant = 'default',
  onAction,
}) => {
  const { colors, isDarkMode } = useTheme();
  
  // Apply platform-specific styling
  const getStyles = () => {
    const baseStyles = {
      backgroundColor: isDarkMode ? colors.backgroundDark : colors.backgroundLight,
      color: isDarkMode ? colors.textDark : colors.textLight,
      borderRadius: '0.5rem',
    };
    
    if (variant === 'bordered') {
      return {
        ...baseStyles,
        border: `2px solid ${colors.primary}`,
      };
    }
    
    if (variant === 'elevated') {
      return {
        ...baseStyles,
        boxShadow: `0 4px 12px ${isDarkMode ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.1)'}`,
      };
    }
    
    return baseStyles;
  };
  
  return (
    <Card style={getStyles()}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      
      {description && (
        <CardContent>
          <p>{description}</p>
        </CardContent>
      )}
      
      {onAction && (
        <CardFooter>
          <Button 
            onClick={onAction}
            style={{
              backgroundColor: colors.primary,
              color: colors.textDark,
            }}
          >
            Take Action
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AIAnnotatedComponent; 