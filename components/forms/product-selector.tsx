"use client";

import { Card, CardContent } from "@/components/ui-custom/card";
import { H4 } from "@/components/ui-custom/typography";
import { Tables } from "@/database.types";
import { GetFromDatabase } from "@/lib/services/general";
import { IProduct } from "@/lib/services/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ProductSearch } from "../search/product-search/product-search";
import { B1 } from "@/components/ui-custom/typography";
import { Button } from "@/components/ui-custom/button";

interface ProductSelectorProps {
	selectedProducts: IProduct[];
	onProductsChange: (products: IProduct[]) => void;
	restrictToUserBusinesses?: boolean;
	userUuid?: string | null;
}

export function ProductSelector({
	selectedProducts,
	onProductsChange,
	restrictToUserBusinesses = false,
	userUuid,
}: ProductSelectorProps) {
	const [businessIds, setBusinessIds] = useState<number[]>([]);
	const [isLoadingBusinessIds, setIsLoadingBusinessIds] = useState(false);

	useEffect(() => {
		if (!restrictToUserBusinesses || !userUuid) return;

		async function loadUserBusinesses() {
			setIsLoadingBusinessIds(true);
			try {
				const { data: userBusinesses } = await GetFromDatabase<Tables<"User_Business">>({
					tableName: "User_Business",
					select: "business_id",
					filters: [{ method: "eq", column: "user_id", value: userUuid }],
				});

				const { data: employeeBusinesses } = await GetFromDatabase<Tables<"Business_Employee">>({
					tableName: "Business_Employee",
					select: "business_id",
					filters: [{ method: "eq", column: "user_id", value: userUuid }],
				});

				const ids = [
					...(userBusinesses?.map((ub) => ub.business_id) || []),
					...(employeeBusinesses?.map((eb) => eb.business_id) || []),
				];

				const uniqueIds = Array.from(new Set(ids));
				setBusinessIds(uniqueIds);
			} catch (error) {
				console.error("Error loading businesses:", error);
				toast.error("Error al cargar empresas");
			} finally {
				setIsLoadingBusinessIds(false);
			}
		}

		loadUserBusinesses();
	}, [userUuid, restrictToUserBusinesses]);

	const handleProductSelect = (product: IProduct) => {
		if (selectedProducts.some((p) => p.id === product.id)) {
			toast.info("Este producto ya está seleccionado");
			return;
		}
		onProductsChange([...selectedProducts, product]);
	};

	const handleRemoveProduct = (productId: number) => {
		onProductsChange(selectedProducts.filter((p) => p.id !== productId));
	};

	if (restrictToUserBusinesses && isLoadingBusinessIds) {
		return <B1 className="text-lightgrey">Cargando información de empresas...</B1>;
	}

	if (restrictToUserBusinesses && businessIds.length === 0) {
		return (
			<Card className="p-6">
				<B1 className="text-lightgrey text-center">
					No tienes empresas asociadas para buscar productos.
				</B1>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<ProductSearch
				businessIds={restrictToUserBusinesses ? businessIds : undefined}
				onProductSelect={handleProductSelect}
				globalSearch={!restrictToUserBusinesses}
			/>

			{selectedProducts.length > 0 && (
				<Card className="p-4 border-input">
					<CardContent className="p-0 space-y-3">
						<H4 className="text-sm font-semibold mb-2">Productos seleccionados:</H4>
						{selectedProducts.map((product) => (
							<div key={product.id} className="flex items-center space-x-3">
								<div className="flex-1">
									<div className="flex justify-between items-center">
										<span>{product.name}</span>
										<div className="flex items-center gap-3">
											<span className="font-semibold">
												{product.msrp?.toFixed(2) || "0.00"}€
											</span>
											<Button
												type="button"
												variant="ghost"
												size="sm"
												className="h-6 w-6 p-0 text-destructive hover:text-destructive/80"
												onClick={() => handleRemoveProduct(product.id)}
											>
												✕
											</Button>
										</div>
									</div>
									{product.description && (
										<B1 className="text-lightgrey text-sm">{product.description}</B1>
									)}
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
