"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Testlist from "@/components/ui/test-list";
import { Hamburger } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ExamplePage() {
    // States represent data that can be changed during the execution of the code
    const [counter, setCounter] = useState<number>(0);
    const [listItems, setListItems] = useState<string[]>([]);
    const [title, setTitle] = useState<string>("This is a title");
    const [randomNumber, setRandomNumber] = useState<number>(0);

    // This should be in another file, for keeping each file small
    function increaseCounter() {
        setCounter(counter + 1);
    }

    // This should be in another file, for keeping each file small
    function addNewElementToList(newElement: string) {
        setListItems([...listItems, newElement]);
    }

    // UseEffects are used for executing code once the variables in the dependency array (the [] at the end of the function) change
    // This changes the state "title" once some ms have passed
    useEffect(() => {
        const timeoutTimeMs = 3000;

        setTimeout(() => {
            setTitle(`That has a ${timeoutTimeMs}ms timeout`);
        }, timeoutTimeMs);
    }, []);

    // This changes the random number once the state "counter" has changed
    useEffect(() => {
        setRandomNumber(Number((Math.random() * 100).toFixed(0)));
    }, [counter]);

    return (
        <div className="flex flex-col justify-center items-center h-svh gap-5">
            {/* Title with state "title" assigned, so that it can change during the execution of the code */}
            <h1 className="text-4xl">{title}</h1>

            {/* Text component with a random number */}
            <p>
                This number changes randomly once counter is modified:{" "}
                {randomNumber}
            </p>

            {/* Animated button that increases counter by using the function */}
            <Button
                onClick={increaseCounter}
                className="hover:translate-y-2 hover:rotate-5 transition duration-500"
            >
                Add +1 to counter
            </Button>

            {/* Same as above, but by programming the function directly into the component */}
            <Button
                onClick={() => {
                    setCounter(counter + 1);
                }}
                className="hover:bg-destructive hover:rotate-360 transition duration-500"
            >
                Add +1 to counter
            </Button>

            {/* Button to add a new element to a list. The variant applies different styling to the component, go to /ui/button.tsx */}
            <Button
                variant={"outline"}
                onClick={() => addNewElementToList(`Element ${counter}`)}
                className="hover:translate-y-2 hover:rotate-5"
            >
                Add an element to the list
            </Button>

            {/* Badge component and an icon, use icons from lucide react */}
            <Badge>
                <Hamburger />
                {counter}
            </Badge>

            {/* Link component */}
            <Link className="underline" href="http://youtube.com">
                Click me
            </Link>

            {/* List component, defined in another file, you can pass info through component "props" (items in this case is a prop) */}
            <Testlist items={listItems} />

            {/* You can navigate through your own page urls like this */}
            <Link href="/">Go home</Link>
        </div>
    );
}
