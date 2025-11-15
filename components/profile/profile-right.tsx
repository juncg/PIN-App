"use client";

import { IBusiness, IUser } from "@/lib/services/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { H3, P } from "../ui-custom/typography";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Badge } from "../ui/badge";
import { Card, CardHeader, CardTitle } from "../ui/card";

interface IProfileUserCompanyState {
	className?: string;
	userData?: IUser;
	companies?: IBusiness[];
}

export default function ProfileUserCompanyState(props: IProfileUserCompanyState) {
	const { className, userData, companies } = props;
	const isBusiness = (userData?.businesses?.length || 0) > 0;

	return (
		<Accordion type="multiple" className={cn("w-full", className)}>
			<AccordionItem value="item-1">
				<AccordionTrigger className="items-center">
					<H3>Estado de la cuenta</H3>
				</AccordionTrigger>

				<AccordionContent className="flex flex-col gap-4 text-balance">
					<Badge className="justify-center">{isBusiness ? "Usuario empresa" : "Cuenta personal"}</Badge>
					<Link href="/upgrade-user">
						<Badge className="w-full justify-center"> Mejora a Business</Badge>
					</Link>
				</AccordionContent>
			</AccordionItem>

			<AccordionItem value="item-2">
				<AccordionTrigger className="items-center">
					<H3>Empresas vinculadas a la cuenta</H3>
				</AccordionTrigger>

				<AccordionContent className="flex flex-col gap-4">
					{companies && companies.length > 0 ? (
						companies.map((company: IBusiness) => (
							<Link key={company.id} href={`/business/${company.id}`}>
								<Card className="hover:bg-accent transition-all">
									<CardHeader>
										<CardTitle>{company.name || "Empresa sin nombre"}</CardTitle>
									</CardHeader>
								</Card>
							</Link>
						))
					) : (
						<P>No hay empresas vinculadas a esta cuenta.</P>
					)}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
