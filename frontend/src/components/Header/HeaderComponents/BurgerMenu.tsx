import MenuNavigation from "./MenuNavigation";
import MenuActions from "./MenuActions";
import Button from "@/components/ui/Button";

interface BurgerMenuProps {
    isOpen: boolean;
    isHidden: boolean;
    isHiddenMenuNavigation: boolean;
    isHiddenMenuActions: boolean;
    isHiddenButton: boolean;
}

const BurgerMenu = ({ isOpen, isHidden, isHiddenMenuNavigation, isHiddenMenuActions, isHiddenButton }: BurgerMenuProps) => {
    return (
        <>
            <div id="burger-menu" className={`fixed z-1 xl:hidden top-0 left-full w-[70vw] sm:w-[50vw] md:w-[30vw] h-screen pt-[100px] flex flex-col items-center gap-y-[40px] bg-[rgba(0,0,0,0.7)] ${isOpen ? '-translate-x-full' : 'translate-x-0'} border-l-2 border-red rounded-l-4xl duration-400 ${isHidden && 'hidden'}`}>
                <MenuActions display="burger" isHidden={isHiddenMenuActions} />
                <MenuNavigation display="burger" isHidden={!isHiddenMenuNavigation} />
                <Button type='link' linkTo='/catalog' paddingBlock="py-[12px]" paddingInline="px-[12px]" textClasses="text-[0.75rem]" addClasses={`max-w-[70%] w-full text-center ${!isHiddenButton && 'hidden'}`}>
                    Заказать звонок
                </Button>
            </div>
            <div className={`fixed top-0 left-0 ${isOpen ? 'w-full h-full' : 'w-0 h-0'} bg-[rgba(0,0,0,0.2)] ${isHidden && 'hidden'}`}></div>
        </>
    );
};

export default BurgerMenu;