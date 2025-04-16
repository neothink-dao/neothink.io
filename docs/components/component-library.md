# Neothink Component Library

This document provides an overview of the shared UI components available across the Neothink platform ecosystem, built with Shadcn/UI, Tailwind CSS, and React.

## Introduction

The Neothink component library provides a collection of reusable, accessible, and customizable UI components that maintain consistency across all platforms while allowing for platform-specific theming.

### Key Features

- **Accessibility**: All components follow WCAG 2.1 guidelines
- **Responsive**: Components adapt to different screen sizes
- **Themeable**: Supports both light and dark modes, plus platform-specific theming
- **Type-safe**: Full TypeScript support
- **Server Component Ready**: Compatible with React Server Components

## Getting Started

### Installation

All components are pre-installed in the monorepo. To add a new Shadcn/UI component:

```bash
npm run ui:add [component-name]
```

For example:

```bash
npm run ui:add button
npm run ui:add card
npm run ui:add dialog
```

### Importing Components

Import components from the shared library:

```tsx
// From the shared library
import { Button } from "@/lib/ui/button"

// Platform-specific components
import { Button } from "@/components/ui/button"
```

## Core Components

### Button

Buttons are used to trigger actions. They come in various styles and sizes.

```tsx
import { Button } from "@/lib/ui/button"

// Default button
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>

// With icon
<Button>
  <PlusIcon className="mr-2 h-4 w-4" />
  Add item
</Button>

// Disabled state
<Button disabled>Disabled</Button>

// Loading state
<Button>
  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
  Please wait
</Button>

// As link
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

### Card

Cards are used to group related content and actions.

```tsx
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/lib/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dialog

Dialogs are used to display content that requires user interaction.

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/lib/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>Dialog Description</DialogDescription>
    </DialogHeader>
    <div className="py-4">
      <p>Dialog Content</p>
    </div>
    <DialogFooter>
      <Button type="submit">Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Form Components

#### Input

```tsx
import { Input } from "@/lib/ui/input"

<Input type="text" placeholder="Enter your name" />
<Input type="email" placeholder="Enter your email" />
<Input type="password" placeholder="Enter your password" />
<Input disabled placeholder="Disabled input" />
```

#### Select

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/lib/ui/select"

<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>
```

#### Checkbox

```tsx
import { Checkbox } from "@/lib/ui/checkbox"

<div className="flex items-center space-x-2">
  <Checkbox id="terms" />
  <label
    htmlFor="terms"
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    Accept terms and conditions
  </label>
</div>
```

#### Radio Group

```tsx
import { RadioGroup, RadioGroupItem } from "@/lib/ui/radio-group"

<RadioGroup defaultValue="option-one">
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-one" id="option-one" />
    <label htmlFor="option-one">Option One</label>
  </div>
  <div className="flex items-center space-x-2">
    <RadioGroupItem value="option-two" id="option-two" />
    <label htmlFor="option-two">Option Two</label>
  </div>
</RadioGroup>
```

### Toast

Toasts are used to show brief messages to users.

```tsx
import { useToast } from "@/lib/ui/toast/use-toast"
import { Button } from "@/lib/ui/button"

export function ToastDemo() {
  const { toast } = useToast()

  return (
    <Button
      onClick={() => {
        toast({
          title: "Scheduled",
          description: "Your meeting has been scheduled.",
        })
      }}
    >
      Show Toast
    </Button>
  )
}
```

Include the Toaster component in your layout:

```tsx
import { Toaster } from "@/lib/ui/toast/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

## Navigation Components

### Tabs

```tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/ui/tabs"

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings content</TabsContent>
  <TabsContent value="password">Password settings content</TabsContent>
</Tabs>
```

### Navigation Menu

```tsx
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/lib/ui/navigation-menu"

<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px]">
          <li>
            <NavigationMenuLink asChild>
              <a href="/docs">Documentation</a>
            </NavigationMenuLink>
          </li>
          <li>
            <NavigationMenuLink asChild>
              <a href="/docs/components">Components</a>
            </NavigationMenuLink>
          </li>
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/lib/ui/dropdown-menu"

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button>Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Data Display Components

### Table

```tsx
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/lib/ui/table"

<Table>
  <TableCaption>A list of recent invoices</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead>Method</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell>Credit Card</TableCell>
      <TableCell className="text-right">Value</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

### Avatar

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/lib/ui/avatar"

<Avatar>
  <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>
```

### Badge

```tsx
import { Badge } from "@/lib/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="outline">Outline</Badge>
<Badge variant="destructive">Destructive</Badge>
```

## Feedback Components

### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "@/lib/ui/alert"
import { InfoIcon } from "lucide-react"

<Alert>
  <InfoIcon className="h-4 w-4" />
  <AlertTitle>Information</AlertTitle>
  <AlertDescription>
    This is an informational alert.
  </AlertDescription>
</Alert>
```

### Progress

```tsx
import { Progress } from "@/lib/ui/progress"

<Progress value={33} />
```

### Skeleton

```tsx
import { Skeleton } from "@/lib/ui/skeleton"

<Skeleton className="h-[20px] w-[100px] rounded-full" />
<Skeleton className="h-[100px] w-[200px] rounded-md" />
```

## Custom Components

### Platform Badge

A custom component that displays the current platform.

```tsx
import { PlatformBadge } from "@/lib/ui/platform-badge"

<PlatformBadge platform="hub" />
<PlatformBadge platform="ascenders" />
<PlatformBadge platform="neothinkers" />
<PlatformBadge platform="immortals" />
```

### Role Gate

A component that conditionally renders content based on user roles.

```tsx
import { RoleGate } from "@/lib/ui/role-gate"

<RoleGate allowedRoles={["admin", "editor"]}>
  <p>This content is only visible to admins and editors.</p>
</RoleGate>
```

### Platform Gate

A component that conditionally renders content based on platform access.

```tsx
import { PlatformGate } from "@/lib/ui/platform-gate"

<PlatformGate platforms={["ascenders", "neothinkers"]}>
  <p>This content is only visible to users with access to Ascenders and Neothinkers.</p>
</PlatformGate>
```

## Theming

### Theme Provider

Wrap your application with the theme provider to enable theming.

```tsx
import { ThemeProvider } from "@/lib/ui/theme-provider"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          defaultTheme="system"
          platformSlug="hub"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### Using Themes

Use the `useTheme` hook to access and change the current theme.

```tsx
import { useTheme } from "@/lib/ui/theme-provider"
import { Button } from "@/lib/ui/button"
import { SunIcon, MoonIcon } from "lucide-react"

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <SunIcon className="h-5 w-5" />
      ) : (
        <MoonIcon className="h-5 w-5" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

## Best Practices

### Accessibility

- Always include proper ARIA attributes
- Ensure proper focus management
- Provide meaningful alt text for images
- Use semantic HTML elements

Example:

```tsx
// Good
<Button aria-label="Close dialog" onClick={closeDialog}>
  <XIcon className="h-4 w-4" />
</Button>

// Bad
<div onClick={closeDialog}>
  <XIcon className="h-4 w-4" />
</div>
```

### Responsiveness

Use responsive class names from Tailwind:

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>
```

### Performance

- Use React.memo for components that render often but rarely change
- Use dynamic imports for large components
- Avoid unnecessary re-renders

Example:

```tsx
import dynamic from 'next/dynamic'

const DynamicChart = dynamic(() => import('@/components/Chart'), {
  loading: () => <p>Loading chart...</p>,
  ssr: false
})
```

## Component Development

### Adding New Components

1. Create the component in the shared library:

```tsx
// lib/ui/my-component.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  // Custom props
}

export function MyComponent({
  className,
  ...props
}: MyComponentProps) {
  return (
    <div 
      className={cn("my-component-classes", className)}
      {...props} 
    />
  )
}
```

2. Export the component from the library index:

```tsx
// lib/ui/index.ts
export * from "./my-component"
```

3. Document the component in this file.

### Testing Components

Use React Testing Library to test components:

```tsx
import { render, screen } from "@testing-library/react"
import { Button } from "./button"

describe("Button", () => {
  it("renders correctly", () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument()
  })
})
```

## Conclusion

This component library is designed to be extended and customized as needed. If you need a component that isn't available, consider adding it to the shared library so all platforms can benefit. 