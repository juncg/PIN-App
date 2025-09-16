export default function Testlist({ items }: { items: string[] }) {
    // This is a list, it receives items, maps through them and displays each of them as a list element
    return (
        <ul className="flex flex-col gap-1">
            {items.map((item: string, index: number) => {
                return (
                    <li
                        className="bg-card-foreground text-white p-2 rounded-lg border-2"
                        key={index}
                    >
                        {item}
                    </li>
                );
            })}
        </ul>
    );
}
