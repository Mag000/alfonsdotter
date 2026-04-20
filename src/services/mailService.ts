import { IMailFormSubmitAction } from "../model/IPage";

export interface IContactPayload {
  namn: string;
  epost: string;
  telefon?: string;
  meddelande: string;
}

export interface IMailResult {
  success: boolean;
  message: string;
}

export const sendContactForm = async (
  payload: IContactPayload,
  action: IMailFormSubmitAction,
): Promise<IMailResult> => {
  const successMessage = action.successMessage ?? "Meddelandet skickades.";
  const errorMessage = action.errorMessage ?? "Något gick fel. Försök igen.";

  try {
    const response = await fetch(action.endpoint, {
      method: action.method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return { success: false, message: errorMessage };
    }

    return { success: true, message: successMessage };
  } catch {
    return { success: false, message: errorMessage };
  }
};
