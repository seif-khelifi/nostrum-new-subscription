"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PillInput } from "@/components/ui/pill-input";
import { StepScreen } from "@/components/steps/step-screen";
import { useStepper } from "@/context/StepperContext";
import { useSituationForm } from "@/context/SituationFormContext";
import { useFormErrorToast, errorKey } from "@/hooks/use-form-error-toast";
import { mailSchema, type MailFormValues } from "@/lib/validations/situation";

export function MailStep() {
	const { next } = useStepper();
	const { formData, updateFormData } = useSituationForm();

	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<MailFormValues>({
		resolver: zodResolver(mailSchema),
		defaultValues: {
			email: formData.email,
		},
		mode: "onTouched",
	});

	useFormErrorToast(errors, errorKey(errors));

	const onSubmit = (data: MailFormValues) => {
		updateFormData({ email: data.email });
		next();
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} noValidate>
			<StepScreen
				title={<>Et pour vous contacter ?</>}
				subtitle={
					<div className="flex flex-wrap items-center gap-2">
						<span>
							{"Je souhaite recevoir un devis personnalisé à l'adresse"}
						</span>
						<PillInput
							type="email"
							placeholder="votre@email.com"
							{...register("email")}
							hasError={!!errors.email}
							inputClassName="min-w-[180px] sm:min-w-[240px]"
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
