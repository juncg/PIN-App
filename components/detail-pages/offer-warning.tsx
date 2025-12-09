
import { Checkbox } from "../ui-custom/checkbox";
import { Card, CardContent } from "../ui-custom/card";

interface OfferWarningProps {
	fee: number;
    acceptedConditions: boolean;
    setAcceptedConditions: (accepted: boolean) => void;
}

export function OfferWarning({
	fee,
    acceptedConditions,
    setAcceptedConditions,
}: OfferWarningProps) {
    return (

        <Card className="border-border bg-transparent">
            <CardContent className="p-4 space-y-3">
                <p className="text-sm text-lightgrey">
                    Al inscribirte en la oferta se realizará un{" "}
                    <span className="font-bold text-white">cargo anticipado de {fee}€</span> como
                    garantía de participación.
                </p>
                <ul className="text-sm text-lightgrey space-y-2 list-disc ml-4">
                    <li className="pl-2">
                        Si la oferta caduca y no se lleva a cabo, se te reembolsarán los {fee}
                        €.
                    </li>
                    <li className="pl-2">
                        Si la oferta se completa, estos {fee}€ se descontarán del importe total a
                        pagar. Sin embargo, si cancelas tu participación una vez completada la oferta, no se
                        devolverán los {fee}€.
                    </li>
                </ul>
                <div className="flex items-start gap-2 pt-1">
                    <Checkbox
                        id="accept-conditions"
                        checked={acceptedConditions}
                        onCheckedChange={(checked) => setAcceptedConditions(!!checked)}
                    />
                    <label
                        htmlFor="accept-conditions"
                        className="text-sm text-white cursor-pointer select-none"
                    >
                        Acepto estas condiciones
                    </label>
                </div>
            </CardContent>
        </Card>
    );

}