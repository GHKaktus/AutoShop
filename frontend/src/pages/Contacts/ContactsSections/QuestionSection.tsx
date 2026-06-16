import { useState } from "react";
import Title from "@/components/ui/Title";
import Subtitle from "@/components/ui/Subtitle";
import Button from "@/components/ui/Button";

const NAME_REGEX = /^[А-Яа-яЁёA-Za-z\s-]{2,50}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{7,18}$/;

interface FormFields {
    name: string;
    phone: string;
    email: string;
    interest: string;
    message: string;
}

type FormErrors = Partial<Record<keyof FormFields | "consent", string>>;

const QuestionSection = () => {

    const [isConsent, setIsConsent] = useState<boolean>(false);
    const [fields, setFields] = useState<FormFields>({
        name: "",
        phone: "",
        email: "",
        interest: "",
        message: ""
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState<boolean>(false);

    function handleClickConsentCheckbox() {
        setIsConsent(prev => !prev);
        setErrors(prev => ({ ...prev, consent: undefined }));
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;
        setFields(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    }

    function validate(): FormErrors {
        const next: FormErrors = {};

        const name = fields.name.trim();
        if (!name) next.name = "Укажите имя";
        else if (!NAME_REGEX.test(name)) next.name = "Имя: 2–50 символов, только буквы";

        const phone = fields.phone.trim();
        const digits = phone.replace(/\D/g, "");
        if (!phone) next.phone = "Укажите телефон";
        else if (!PHONE_REGEX.test(phone) || digits.length < 7) next.phone = "Некорректный номер телефона";

        const email = fields.email.trim();
        if (email && !EMAIL_REGEX.test(email)) next.email = "Некорректный e-mail";

        if (fields.interest.trim().length > 100) next.interest = "Не более 100 символов";

        const message = fields.message.trim();
        if (!message) next.message = "Введите сообщение";
        else if (message.length < 5) next.message = "Слишком короткое сообщение";
        else if (message.length > 1000) next.message = "Не более 1000 символов";

        if (!isConsent) next.consent = "Необходимо согласие на обработку данных";

        return next;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const validationErrors = validate();
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length > 0) {
            setSubmitted(false);
            return;
        }
        setSubmitted(true);
        setFields({ name: "", phone: "", email: "", interest: "", message: "" });
        setIsConsent(false);
    }

    return (
        <section className="relative py-[88px] bg-page-contacts-question bg-cover bg-center bg-no-repeat">
            <div className="relative z-2 container text-white flex flex-col items-center">
                <Title>
                    Вопросы?
                </Title>
                <Subtitle color="text-white" width="max-w-[892px]">
                    Менеджеры компании с радостью ответят на ваши вопросы и помогут с выбором нужной продукции.
                </Subtitle>
                <form className="max-w-[648px] w-full" onSubmit={handleSubmit} noValidate>
                    <fieldset className="w-full flex flex-col gap-y-[16px] mb-[40px]">
                        <legend className="visually-hidden">
                            Ваши данные
                        </legend>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="name">Ваше имя:<span className="text-red">*</span></label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={fields.name}
                                onChange={handleChange}
                                maxLength={50}
                                required
                                aria-invalid={Boolean(errors.name)}
                                className={`w-full h-[40px] pl-[10px] text-black bg-white border-2 ${errors.name ? 'border-red' : 'border-transparent'}`}
                            />
                            {errors.name && <span className="text-red text-[0.875rem]">{errors.name}</span>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="phone">Телефон:<span className="text-red">*</span></label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={fields.phone}
                                onChange={handleChange}
                                maxLength={18}
                                required
                                aria-invalid={Boolean(errors.phone)}
                                className={`w-full h-[40px] pl-[10px] text-black bg-white border-2 ${errors.phone ? 'border-red' : 'border-transparent'}`}
                            />
                            {errors.phone && <span className="text-red text-[0.875rem]">{errors.phone}</span>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="email">E-mail:</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={fields.email}
                                onChange={handleChange}
                                maxLength={254}
                                aria-invalid={Boolean(errors.email)}
                                className={`w-full h-[40px] pl-[10px] text-black bg-white border-2 ${errors.email ? 'border-red' : 'border-transparent'}`}
                            />
                            {errors.email && <span className="text-red text-[0.875rem]">{errors.email}</span>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="interest">Интересующий товар / услуга:</label>
                            <input
                                type="text"
                                id="interest"
                                name="interest"
                                value={fields.interest}
                                onChange={handleChange}
                                maxLength={100}
                                aria-invalid={Boolean(errors.interest)}
                                className={`w-full h-[40px] pl-[10px] text-black bg-white border-2 ${errors.interest ? 'border-red' : 'border-transparent'}`}
                            />
                            {errors.interest && <span className="text-red text-[0.875rem]">{errors.interest}</span>}
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="message">Сообщение:<span className="text-red">*</span></label>
                            <textarea
                                name="message"
                                id="message"
                                value={fields.message}
                                onChange={handleChange}
                                maxLength={1000}
                                required
                                aria-invalid={Boolean(errors.message)}
                                className={`w-full h-[164px] pl-[10px] text-black bg-white border-2 ${errors.message ? 'border-red' : 'border-transparent'}`}
                            ></textarea>
                            {errors.message && <span className="text-red text-[0.875rem]">{errors.message}</span>}
                        </div>
                    </fieldset>
                    <div className="w-full flex items-center justify-start mb-[16px] flex-wrap gap-y-2">
                        <label htmlFor="consent" className="block w-[30px] h-[30px] p-[8px] bg-white rounded-full mr-[16px] cursor-pointer" onClick={handleClickConsentCheckbox}>
                            <div className={`w-full h-full rounded-full ${isConsent ? 'bg-red' : 'bg-white'} duration-200`}></div>
                        </label>
                        Я согласен на&nbsp;<span className="text-red">обработку персональных данных</span>
                        <input type="checkbox" className="visually-hidden" id="consent" name="consent" checked={isConsent} readOnly />
                    </div>
                    {errors.consent && <p className="text-red text-[0.875rem] mb-[16px]">{errors.consent}</p>}
                    {submitted && <p className="text-green text-[0.875rem] mb-[16px]">Сообщение отправлено. Мы свяжемся с вами в ближайшее время.</p>}
                    <Button type='submit' linkTo='' paddingBlock="py-[12px]" paddingInline="px-[20px]">
                        <div className="w-[128px] h-[16px] text-[0.75rem]">Отправить</div>
                    </Button>
                </form>
            </div>
            <div className="absolute z-1 top-0 left-0 w-full h-full [background-image:linear-gradient(rgba(0,0,0,0.7),#000)]">

            </div>
        </section>
    );
};

export default QuestionSection;
