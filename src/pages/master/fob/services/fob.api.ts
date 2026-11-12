import axios from "axios";
import { api } from "../../../../services/api";
import type { CreateFobPayload, Fob, FobFilters } from "../types/fob.types";

export const createFob = async (payload: CreateFobPayload): Promise<Fob> => {
    const response = await api.post<Fob>("/fobs", payload);
    return response.data;
};

export const getFob = async ({ clientType, country }: FobFilters): Promise<Fob | null> => {
    try {
        const response = await api.get<Fob>("/fobs", { params: { clientType, country } });
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError<{ message?: string }>(error)) {
        return error.response?.data?.message ?? error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return "An unexpected error occurred.";
};
