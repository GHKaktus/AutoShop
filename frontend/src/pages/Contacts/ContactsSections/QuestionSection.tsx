import { useState } from "react";
import Title from "@/components/ui/Title";
import Subtitle from "@/components/ui/Subtitle";
import Button from "@/components/ui/Button"; 

const QuestionSection = () => {

    const [isConsent, setIsConsent] = useState<boolean>(false);

    function handleClickConsentCheckbox() {
        setIsConsent(prev => !prev);
    }

    return (
        <section className="relative py-[88px] [background:url('/src/assets/images/contacts/question-section/bg-car.png')_center/cover_no-repeat]">
            <div className="relative z-2 container text-white flex flex-col items-center">
                <Title className="mb-[32px]">
                    Вопросы?
                </Title>
                <Subtitle color="text-white" width="max-w-[892px]">
                    Менеджеры компании с радостью ответят на ваши вопросы и помогут с выбором нужной продукции.
                </Subtitle>
                <form className="max-w-[648px] w-full">
                    <fieldset className="w-full flex flex-col gap-y-[16px] mb-[40px]">
                        <legend className="visually-hidden">
                            Ваши данные
                        </legend>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="name">Ваше имя:<span className="text-red">*</span></label>
                            <input type="text" id="name" name="name" className="w-full h-[40px] pl-[10px] text-black bg-white" />
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="phone">Телефон:<span className="text-red">*</span></label>
                            <input type="tel" id="phone" name="phone" className="w-full h-[40px] pl-[10px] text-black bg-white" />
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="email">E-mail:</label>
                            <input type="email" id="email" name="email" className="w-full h-[40px] pl-[10px] text-black bg-white" />
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="interest">Интересующий товар / услуга:</label>
                            <input type="text" id="interest" name="interest" className="w-full h-[40px] pl-[10px] text-black bg-white" />
                        </div>
                        <div className="w-full flex flex-col items-start gap-y-[8px]">
                            <label htmlFor="message">Сообщение:<span className="text-red">*</span></label>
                            <textarea name="message" id="message" className="w-full h-[164px] pl-[10px] text-black bg-white"></textarea>
                        </div>
                    </fieldset>
                    <div className="w-full flex items-center justify-start mb-[40px] flex-wrap gap-y-2">
                        <label htmlFor="consent" className="block w-[30px] h-[30px] p-[8px] bg-white rounded-full mr-[16px] cursor-pointer" onClick={handleClickConsentCheckbox}>
                            <div className={`w-full h-full rounded-full ${isConsent ? 'bg-red' : 'bg-white'} duration-200`}></div>
                        </label>
                        Я согласен на&nbsp;<span className="text-red">обработку персональных данных</span>
                        <input type="checkbox" className="visually-hidden" id="consent" name="consent" value={String(isConsent)}/>
                    </div>
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