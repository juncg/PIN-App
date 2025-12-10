import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { useState } from 'react';

export default {
  title: 'UI/Tabs',
  component: Tabs,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  render: () => (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Account</h3>
          <p className="text-sm text-lightgrey">
            Make changes to your account here. Click save when you're done.
          </p>
        </div>
      </TabsContent>
      <TabsContent value="password">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-lightgrey">
            Change your password here. After saving, you'll be logged out.
          </p>
        </div>
      </TabsContent>
    </Tabs>
  ),
};

export const WithIcons = {
  render: () => (
    <Tabs defaultValue="tab1" className="w-[400px]">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        <TabsTrigger value="tab3">Tab 3</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">
        <p>Content for Tab 1</p>
      </TabsContent>
      <TabsContent value="tab2">
        <p>Content for Tab 2</p>
      </TabsContent>
      <TabsContent value="tab3">
        <p>Content for Tab 3</p>
      </TabsContent>
    </Tabs>
  ),
};

export const Controlled = {
  render: () => {
    const [value, setValue] = useState('tab1');
    return (
      <Tabs value={value} onValueChange={setValue} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">
          <p>Controlled Tab 1 - Current: {value}</p>
        </TabsContent>
        <TabsContent value="tab2">
          <p>Controlled Tab 2 - Current: {value}</p>
        </TabsContent>
      </Tabs>
    );
  },
};