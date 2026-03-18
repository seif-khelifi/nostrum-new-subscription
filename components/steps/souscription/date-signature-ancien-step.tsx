"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { AlertBanner } from "@/components/ui/alert";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
	dateSignatureAncienSchema,
	type DateSignatureAncienFormValues,
} from "@/lib/validations/situation";

export function DateSignatureAncienStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<DateSignatureAncienFormValues>({
		resolver: zodResolver(dateSignatureAncienSchema),
		defaultValues: {
			dateSignature: formData.dateSignatureAncienContrat
				? new Date(formData.dateSignatureAncienContrat)
				: undefined,
		},
		mode: "onTouched",
	});

	useFormErrorToast(errors, errorKey(errors));

	const onSubmit = (data: DateSignatureAncienFormValues) => {
		updateFormData({
			dateSignatureAncienContrat: data.dateSignature.toISOString(),
		});
		next();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<StepScreen
				title={<>Mes infos d&apos;assurance</>}
				subtitle={
					<div className="flex flex-wrap items-center gap-2">
						<span>J&apos;ai signé mon ancien contrat le</span>
						<Controller
							name="dateSignature"
							control={control}
							render={({ field }) => (
								<PillDatePicker
									value={field.value}
									onChange={field.onChange}
									placeholder="JJ/MM/AAAA"
									hasError={!!errors.dateSignature}
									inputClassName="min-w-[120px] sm:min-w-[160px]"
								/>
							)}
						/>
					</div>
				}
				infoCard={
					<AlertBanner
						title="Nostrum Care rembourse plus de 40 médecines douces :"
						subtitle="ostéopathie, sophrologie, psychologie, acupuncture, naturopathie, coaching, et bien plus."
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
