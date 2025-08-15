# UI Components Documentation

This README provides an overview of all UI components in the `src/components/ui` folder. Each component is briefly explained with a simple usage example. For full props and advanced usage, refer to the source code.

---

## Accordion
**Description:** Expand/collapse content sections.
**Example:**
```tsx
import { Accordion, AccordionItem, AccordionTrigger } from './accordion';
<Accordion>
  <AccordionItem>
    <AccordionTrigger>Section 1</AccordionTrigger>
    <div>Content 1</div>
  </AccordionItem>
</Accordion>
```

## Alert & AlertDialog
**Description:** Display alerts and dialogs for user actions.
**Example:**
```tsx
import { Alert } from './alert';
<Alert variant="destructive">Error occurred!</Alert>
```
```tsx
import { AlertDialog, AlertDialogTrigger } from './alert-dialog';
<AlertDialog>
  <AlertDialogTrigger>Open</AlertDialogTrigger>
  {/* Dialog content here */}
</AlertDialog>
```

## AspectRatio
**Description:** Maintain aspect ratio for content.
**Example:**
```tsx
import { AspectRatio } from './aspect-ratio';
<AspectRatio ratio={16/9}><img src="..." /></AspectRatio>
```

## Avatar
**Description:** User profile image or fallback.
**Example:**
```tsx
import { Avatar, AvatarImage, AvatarFallback } from './avatar';
<Avatar>
  <AvatarImage src="avatar.png" />
  <AvatarFallback>AB</AvatarFallback>
</Avatar>
```

## Badge
**Description:** Small status or label.
**Example:**
```tsx
import { Badge } from './badge';
<Badge variant="secondary">New</Badge>
```

## Breadcrumb
**Description:** Navigation path display.
**Example:**
```tsx
import { Breadcrumb, BreadcrumbList, BreadcrumbItem } from './breadcrumb';
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>Home</BreadcrumbItem>
    <BreadcrumbItem>Page</BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

## Button
**Description:** Various styled buttons.
**Example:**
```tsx
import { Button } from './button';
<Button variant="primary">Click Me</Button>
```

## Calendar
**Description:** Date picker component.
**Example:**
```tsx
import { Calendar } from './calendar';
<Calendar />
```

## Card
**Description:** Container for grouped content.
**Example:**
```tsx
import { Card, CardHeader, CardTitle } from './card';
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <div>Body</div>
</Card>
```

## Carousel
**Description:** Scrollable item slider.
**Example:**
```tsx
import { Carousel } from './carousel';
<Carousel>
  {/* Carousel items here */}
</Carousel>
```

## Chart
**Description:** Data visualization charts.
**Example:**
```tsx
import { ChartContainer } from './chart';
<ChartContainer config={{}}>{/* Chart content */}</ChartContainer>
```

## Checkbox
**Description:** Toggleable checkbox input.
**Example:**
```tsx
import { Checkbox } from './checkbox';
<Checkbox checked={true} />
```

## Collapsible
**Description:** Expand/collapse content.
**Example:**
```tsx
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
<Collapsible>
  <CollapsibleTrigger>Show</CollapsibleTrigger>
  <CollapsibleContent>Hidden Content</CollapsibleContent>
</Collapsible>
```

## Command
**Description:** Command palette/dialog.
**Example:**
```tsx
import { CommandDialog } from './command';
<CommandDialog open={true}>{/* Command content */}</CommandDialog>
```

## ContextMenu
**Description:** Right-click context menu.
**Example:**
```tsx
import { ContextMenu, ContextMenuTrigger } from './context-menu';
<ContextMenu>
  <ContextMenuTrigger>Right Click Me</ContextMenuTrigger>
  {/* Menu items */}
</ContextMenu>
```

## Dialog
**Description:** Modal dialog window.
**Example:**
```tsx
import { Dialog, DialogTrigger } from './dialog';
<Dialog>
  <DialogTrigger>Open Dialog</DialogTrigger>
  {/* Dialog content */}
</Dialog>
```

## Drawer
**Description:** Slide-in panel from edge.
**Example:**
```tsx
import { Drawer, DrawerTrigger } from './drawer';
<Drawer>
  <DrawerTrigger>Open Drawer</DrawerTrigger>
  {/* Drawer content */}
</Drawer>
```

## DropdownMenu
**Description:** Dropdown menu for actions.
**Example:**
```tsx
import { DropdownMenu, DropdownMenuTrigger } from './dropdown-menu';
<DropdownMenu>
  <DropdownMenuTrigger>Open Menu</DropdownMenuTrigger>
  {/* Menu items */}
</DropdownMenu>
```

## Form
**Description:** Form context and fields.
**Example:**
```tsx
import { Form, FormField } from './form';
<Form>{/* Form fields */}</Form>
```

## HoverCard
**Description:** Card shown on hover.
**Example:**
```tsx
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';
<HoverCard>
  <HoverCardTrigger>Hover Me</HoverCardTrigger>
  <HoverCardContent>Info</HoverCardContent>
</HoverCard>
```

## Input & InputOTP
**Description:** Text input and OTP input.
**Example:**
```tsx
import { Input } from './input';
<Input placeholder="Type here" />
```
```tsx
import { InputOTP } from './input-otp';
<InputOTP length={6} />
```

## Label
**Description:** Form label.
**Example:**
```tsx
import { Label } from './label';
<Label htmlFor="input">Label</Label>
```

## Menubar
**Description:** Menu bar navigation.
**Example:**
```tsx
import { Menubar } from './menubar';
<Menubar>{/* Menu items */}</Menubar>
```

## NavigationMenu
**Description:** Navigation menu bar.
**Example:**
```tsx
import { NavigationMenu } from './navigation-menu';
<NavigationMenu>{/* Menu items */}</NavigationMenu>
```

## Pagination
**Description:** Page navigation controls.
**Example:**
```tsx
import { Pagination } from './pagination';
<Pagination />
```

## Popover
**Description:** Popover content on trigger.
**Example:**
```tsx
import { Popover, PopoverTrigger, PopoverContent } from './popover';
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverContent>Popover Content</PopoverContent>
</Popover>
```

## Progress
**Description:** Progress bar.
**Example:**
```tsx
import { Progress } from './progress';
<Progress value={50} />
```

## RadioGroup
**Description:** Group of radio buttons.
**Example:**
```tsx
import { RadioGroup, RadioGroupItem } from './radio-group';
<RadioGroup>
  <RadioGroupItem value="1" />
  <RadioGroupItem value="2" />
</RadioGroup>
```

## Resizable
**Description:** Resizable panel group.
**Example:**
```tsx
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from './resizable';
<ResizablePanelGroup>
  <ResizablePanel>Panel 1</ResizablePanel>
  <ResizableHandle />
  <ResizablePanel>Panel 2</ResizablePanel>
</ResizablePanelGroup>
```

## ScrollArea
**Description:** Custom scrollable area.
**Example:**
```tsx
import { ScrollArea } from './scroll-area';
<ScrollArea>{/* Content */}</ScrollArea>
```

## Select
**Description:** Select dropdown input.
**Example:**
```tsx
import { Select, SelectTrigger } from './select';
<Select>
  <SelectTrigger>Select an option</SelectTrigger>
  {/* Options */}
</Select>
```

## Separator
**Description:** Horizontal or vertical separator.
**Example:**
```tsx
import { Separator } from './separator';
<Separator />
```

## Sheet
**Description:** Slide-in sheet panel.
**Example:**
```tsx
import { Sheet, SheetTrigger } from './sheet';
<Sheet>
  <SheetTrigger>Open Sheet</SheetTrigger>
  {/* Sheet content */}
</Sheet>
```

## Sidebar
**Description:** Sidebar navigation and controls.
**Example:**
```tsx
import { Sidebar } from './sidebar';
<Sidebar>{/* Sidebar content */}</Sidebar>
```

## Skeleton
**Description:** Loading placeholder.
**Example:**
```tsx
import { Skeleton } from './skeleton';
<Skeleton className="h-4 w-32" />
```

## Slider
**Description:** Range slider input.
**Example:**
```tsx
import { Slider } from './slider';
<Slider defaultValue={[50]} max={100} />
```

## Sonner
**Description:** Toast notification system.
**Example:**
```tsx
import { Toaster, toast } from './sonner';
toast('Hello!');
<Toaster />
```

## Switch
**Description:** Toggle switch input.
**Example:**
```tsx
import { Switch } from './switch';
<Switch checked={true} />
```

## Table
**Description:** Table layout for data.
**Example:**
```tsx
import { Table, TableHeader, TableBody } from './table';
<Table>
  <TableHeader>{/* Header rows */}</TableHeader>
  <TableBody>{/* Data rows */}</TableBody>
</Table>
```

## Tabs
**Description:** Tabbed navigation.
**Example:**
```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
<Tabs>
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</Tabs>
```

## Textarea
**Description:** Multiline text input.
**Example:**
```tsx
import { Textarea } from './textarea';
<Textarea placeholder="Type here" />
```

## Toast & Toaster
**Description:** Toast notifications and provider.
**Example:**
```tsx
import { Toaster } from './toaster';
<Toaster />
```

## Toggle & ToggleGroup
**Description:** Toggle button and group.
**Example:**
```tsx
import { Toggle } from './toggle';
<Toggle>Toggle Me</Toggle>
```
```tsx
import { ToggleGroup, ToggleGroupItem } from './toggle-group';
<ToggleGroup>
  <ToggleGroupItem value="1">One</ToggleGroupItem>
  <ToggleGroupItem value="2">Two</ToggleGroupItem>
</ToggleGroup>
```

## Tooltip
**Description:** Tooltip for elements.
**Example:**
```tsx
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
<Tooltip>
  <TooltipTrigger>Hover</TooltipTrigger>
  <TooltipContent>Tooltip text</TooltipContent>
</Tooltip>
```

## use-toast
**Description:** Custom hook for toast notifications.
**Example:**
```tsx
import { useToast } from './use-toast';
const { toast } = useToast();
toast('Message');
```

---

## Other Components
All other files in this folder are also UI components. For details, refer to their source code. This README covers all files in the `ui` subfolder as of August 2025.
