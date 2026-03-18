"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { recapSchema, type RecapFormValues } from "@/lib/validations/situation";

export function RecapStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<RecapFormValues>({
		resolver: zodResolver(recapSchema),
		defaultValues: {
			firstName: formData.firstName,
			lastName: formData.lastName,
			birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
			email: formData.email,
			phone: formData.phone,
		},
		mode: "onTouched",
	});

	useFormErrorToast(errors, errorKey(errors));

	const onSubmit = (data: RecapFormValues) => {
		updateFormData({
			firstName: data.firstName,
			lastName: data.lastName,
			birthDate: data.birthDate.toISOString(),
			email: data.email,
			phone: data.phone,
		});
		next();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<StepScreen
				title={<>Je crée mon compte</>}
				subtitle="Je recevrai un SMS pour confirmer mes infos."
				canProceed={isValid}
				onNext={() => handleSubmit(onSubmit)()}
				isForm
			>
				{/* Recap phrase with inline pill fields */}
				<div className="flex flex-wrap items-center gap-2 font-semibold text-base sm:text-lg text-[#1D1B20]">
					<span>Mes informations sont exactes :</span>
					<PillInput
						placeholder="Nom"
						{...register("lastName")}
						hasError={!!errors.lastName}
						inputClassName="min-w-[100px] sm:min-w-[140px]"
					/>

					<Controller
						name="birthDate"
						control={control}
						render={({ field }) => (
							<PillDatePicker
								value={field.value}
								onChange={field.onChange}
								placeholder="JJ/MM/AAAA"
								hasError={!!errors.birthDate}
								inputClassName="min-w-[120px] sm:min-w-[160px]"
							/>
						)}
					/>
					<PillInput
						type="email"
						placeholder="votre@email.com"
						{...register("email")}
						hasError={!!errors.email}
						inputClassName="min-w-[180px] sm:min-w-[240px]"
					/>
					<PillInput
						type="tel"
						placeholder="06 12 34 56 78"
						{...register("phone")}
						hasError={!!errors.phone}
						inputClassName="min-w-[150px] sm:min-w-[200px]"
					/>
				</div>
			</StepScreen>
		</form>
	);
}
