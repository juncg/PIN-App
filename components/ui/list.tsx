export function List({ item1, item2, item3 }: { item1: string, item2: string, item3: string }) {
    return (
        <ul>
            <li>{item1}</li>
            <li>{item2}</li>
            <li>{item3}</li>
        </ul>
    )
}