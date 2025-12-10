import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';

export default {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This is the main content of the card.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithoutHeader = {
  render: () => (
    <Card className="w-80">
      <CardContent>
        <p>This card has no header, just content.</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Cancel</Button>
        <Button>Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithImage = {
  render: () => (
    <Card className="w-80">
      <CardHeader>
        <img src="/placeholder.png" alt="Card image" className="w-full h-32 object-cover rounded-t-xl" />
        <CardTitle>Image Card</CardTitle>
        <CardDescription>A card with an image.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content below the image.</p>
      </CardContent>
    </Card>
  ),
};

export const Compact = {
  render: () => (
    <Card className="w-64">
      <CardContent className="p-4">
        <CardTitle className="text-lg">Compact Card</CardTitle>
        <CardDescription className="text-sm">Smaller padding and size.</CardDescription>
      </CardContent>
    </Card>
  ),
};