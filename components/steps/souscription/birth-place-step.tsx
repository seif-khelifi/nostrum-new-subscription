"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PillInput } from "@/components/ui/pill-input";
import { InfoIcon } from "lucide-react";

import { PillCombobox } from "@/components/ui/pill-combobox";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { birthPlaceSchema, type BirthPlaceFormValues } from "@/lib/validations/situation";

/* ─── Hardcoded French cities for combobox ─── */

const FRENCH_CITIES = [
	"Paris",
	"Lyon",
	"Marseille",
	"Toulouse",
	"Nice",
	"Nantes",
	"Strasbourg",
	"Montpellier",
	"Bordeaux",
	"Lille",
	"Rennes",
	"Reims",
	"Saint-Étienne",
	"Toulon",
	"Le Havre",
	"Grenoble",
	"Dijon",
	"Angers",
	"Nîmes",
	"Aix-en-Provence",
];

/* ─── Helper ─── */

function isFrance(country: string | undefined): boolean {
	if (!country) return false;
	return country.trim().toLowerCase() === "france";
}

/* ─── Component ─── */

export function BirthPlaceStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const {
		register,
		control,
		handleSubmit,
		watch,
		formState: { errors, isValid },
	} = useForm<BirthPlaceFormValues>({
		resolver: zodResolver(birthPlaceSchema),
		defaultValues: {
			birthCountry: formData.birthCountry,
			birthCity: formData.birthCity,
		},
		mode: "onTouched",
	});

	useFormErrorToast(errors, errorKey(errors));

	const country = watch("birthCountry");

	const onSubmit = (data: BirthPlaceFormValues) => {
		updateFormData({
			birthCountry: data.birthCountry,
			birthCity: data.birthCity,
		});
		next();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<StepScreen
				title={<>Mes infos personnelles</>}
				subtitle={
					<div className="flex flex-wrap items-center gap-2">
						<span>Je suis né(e) en</span>
						<PillInput
							placeholder="Pays"
							{...register("birthCountry")}
							hasError={!!errors.birthCountry}
							inputClassName="min-w-[100px] sm:min-w-[140px]"
						/>
						<span>à</span>
						{isFrance(country) ? (
							<Controller
								name="birthCity"
								control={control}
								render={({ field }) => (
									<PillCombobox
										options={FRENCH_CITIES}
										value={field.value}
										onValueChange={field.onChange}
										placeholder="Ville"
										hasError={!!errors.birthCity}
										inputClassName="min-w-[120px] sm:min-w-[180px]"
									/>
								)}
							/>
						) : (
							<PillInput
								placeholder="Ville"
								{...register("birthCity")}
								hasError={!!errors.birthCity}
								inputClassName="min-w-[120px] sm:min-w-[180px]"
							/>
						)}
					</div>
				}
				infoCard={
					<AlertBanner
						variant="info"
						title="Vous choisirez ensuite si vous préférez échanger par email, WhatsApp ou téléphone."
						subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
						icon={<InfoIcon className="size-5 text-[#9000E3]" />}
					/>
				}
				canProceed={isValid}
				onNext={() => handleSubmit(onSubmit)()}
				isForm
			>
				{/* No additional children — form is in subtitle */}
				<></>
			</StepScreen>
		</form>
	);
}
