import Title from "@/components/ui/Title";
import Subtitle from "@/components/ui/Subtitle";
import PhoneIcon from "@assets/icons/tel-icon.svg?react";
import EmailIcon from "@assets/icons/email-icon.svg?react";
import MessageIcon from "@assets/icons/message.svg?react";
import OClockIcon from "@assets/icons/o-clock.svg?react";

const ContactSection = () => {
    return (
        <section className="py-[88px] bg-[#EDEDED]">
            <div className="container flex flex-col items-center">
                <Title>
                    Контакты
                </Title>
                <Subtitle color="text-black2">
                    Аккумуляторы и автомасла в Перми
                </Subtitle>
                <div className="w-full flex flex-col-reverse md:flex-row md:justify-center">
                    {/* Данные */}
                    <div className="w-full h-full max-h-[642px] md:max-h-[442px] py-[72px] px-[32px] sm:py-[82px] sm:px-[62px] text-white bg-black2">
                        {/* Связь */}
                        <div className="">
                            <h3 className="text-[1.5rem] font-medium mb-[38px]">
                                Как с нами связаться
                            </h3>
                            <div className="flex flex-col items-start gap-y-[16px] mb-[30px]">
                                <div className="flex items-center justify-start gap-x-[16px]">
                                    <PhoneIcon />
                                    +7-978-575-73-56
                                </div>
                                <div className="flex items-center justify-start gap-x-[16px]">
                                    <EmailIcon />
                                    avantix5@gmail.com
                                </div>
                                <div className="flex items-center justify-start gap-x-[16px]">
                                    <MessageIcon />
                                    г. Севастополь, ул. Университетская 33
                                </div>
                            </div>
                        </div>
                        {/* Режим работы */}
                        <div className="">
                            <h3 className="text-[1.5rem] font-medium mb-[38px]">
                                Режим работы
                            </h3>
                            <div className="">
                                <div className="flex items-center justify-start gap-x-[16px]">
                                    <OClockIcon />
                                    Пн. – Вс.: с 9:00 до 18:00
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Карта */}
                    <div className="w-full h-[442px] bg-amber-200">
                        
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;