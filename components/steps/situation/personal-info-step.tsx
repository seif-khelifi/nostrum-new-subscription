"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PillInput } from "@/components/ui/pill-input";
import { PillDatePicker } from "@/components/ui/pill-date-picker";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import {
	personalInfoSchema,
	type PersonalInfoFormValues,
} from "@/lib/validations/situation";

export function PersonalInfoStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<PersonalInfoFormValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: formData.firstName,
			lastName: formData.lastName,
			birthDate: formData.birthDate ? new Date(formData.birthDate) : undefined,
		},
		mode: "onTouched",
	});

	useFormErrorToast(errors, errorKey(errors));

	const onSubmit = (data: PersonalInfoFormValues) => {
		updateFormData({
			firstName: data.firstName,
			lastName: data.lastName,
			birthDate: data.birthDate.toISOString(),
		});
		next();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<StepScreen
				title={<>Dites-nous qui vous êtes ?</>}
				subtitle={
					<div className="flex flex-wrap items-center gap-2">
						<span>Je m&apos;appelle</span>
						<PillInput
							placeholder="Prénom"
							{...register("firstName")}
							hasError={!!errors.firstName}
							inputClassName="min-w-[100px] sm:min-w-[140px]"
						/>
						<PillInput
							placeholder="Nom"
							{...register("lastName")}
							hasError={!!errors.lastName}
							inputClassName="min-w-[100px] sm:min-w-[140px]"
						/>
						<span>, née le</span>
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
					</div>
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
