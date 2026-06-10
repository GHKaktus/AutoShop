export interface WelcomeInformation {
    title: string;
    buttonText: string;
    image?: string;
}

export interface ComponentProps {
    information: WelcomeInformation;
}