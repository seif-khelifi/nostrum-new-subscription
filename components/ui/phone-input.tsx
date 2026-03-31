"use client";

import * as React from "react";
import { CheckIcon, ChevronsUpDown } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    hasError?: boolean;
  };

const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, value, hasError, ...props }, ref) => {
      const filled = Boolean(value);

      return (
        <RPNInput.default
          ref={ref}
          className={cn(
            /* shared layout – same radius & height as PillInput */
            "group relative inline-flex h-9 items-center rounded-xl px-0.5",
            "transition-colors duration-200 ease-out",
            /* focus / hover rings */
            "hover:ring-2 hover:ring-primary/10",
            "focus-within:ring-2 focus-within:ring-primary/20",
            /* state colours – same as PillInput */
            filled ? "bg-[#490076] text-white" : "bg-[#F3E5FA] text-[#490076]",
            "[&:has(input:-webkit-autofill)]:bg-[#490076] [&:has(input:-webkit-autofill)]:text-white",
            /* error state — red ring */
            hasError &&
              "ring-2 ring-red-500/60 hover:ring-red-500/80 focus-within:ring-red-500/80",
            className,
          )}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={PillInputComponent}
          smartCaret={false}
          value={value || undefined}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const PillInputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, value, ...props }, ref) => {
  const isFilled = Boolean(value);
  return (
    <input
      className={cn(
        "h-full flex-1 rounded-r-xl bg-transparent pl-2 pr-3 text-[15px] font-medium outline-none",
        isFilled
          ? "text-white placeholder:text-white/60"
          : "text-[#490076] placeholder:text-[#490076]/60",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "selection:bg-white/30 selection:text-inherit",

        "[&:-webkit-autofill]:[-webkit-text-fill-color:white]",
        "[&:-webkit-autofill]:[caret-color:white]",
        "[&:-webkit-autofill]:[box-shadow:0_0_0_1000px_#490076_inset]",
        "[&:-webkit-autofill:hover]:[box-shadow:0_0_0_1000px_#490076_inset]",
        "[&:-webkit-autofill:focus]:[box-shadow:0_0_0_1000px_#490076_inset]",
        "[&:-webkit-autofill]:[transition:background-color_9999s_ease-out_0s]",

        className,
      )}
      {...props}
      value={value}
      ref={ref}
    />
  );
});
PillInputComponent.displayName = "PillInputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const [searchValue, setSearchValue] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Popover
      open={isOpen}
      modal
      onOpenChange={(open) => {
        setIsOpen(open);
        open && setSearchValue("");
      }}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-full gap-1 rounded-l-xl rounded-r-none border-r-0 px-2 focus:z-10",
            "hover:bg-transparent",
          )}
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-mr-1 size-3.5 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            value={searchValue}
            onValueChange={(value) => {
              setSearchValue(value);
              setTimeout(() => {
                if (scrollAreaRef.current) {
                  const viewportElement = scrollAreaRef.current.querySelector(
                    "[data-radix-scroll-area-viewport]",
                  );
                  if (viewportElement) {
                    viewportElement.scrollTop = 0;
                  }
                }
              }, 0);
            }}
            placeholder="Rechercher un pays..."
          />
          <CommandList>
            <ScrollArea ref={scrollAreaRef} className="h-72">
              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                      onSelectComplete={() => setIsOpen(false)}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
  onSelectComplete: () => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
  onSelectComplete,
}: CountrySelectOptionProps) => {
  const handleSelect = () => {
    onChange(country);
    onSelectComplete();
  };

  return (
    <CommandItem className="gap-2" onSelect={handleSelect}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg:not([class*='size-'])]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
