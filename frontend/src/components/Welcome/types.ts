export interface WelcomeInformation {
    title: string;
    buttonText: string;
    /** @deprecated use imageClass */
    image?: string;
    imageClass?: string;
}

export interface ComponentProps {
    information: WelcomeInformation;
}