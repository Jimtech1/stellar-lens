import { api } from "./api";
import { toast } from "sonner";

/**
 * Signs a transaction XDR using the provided signer function (from WalletContext)
 * and submits it to the backend for broadcasting.
 * 
 * @param transactionXdr The base64 encoded transaction envelope XDR
 * @param signTransaction The signing function from useWallet()
 * @returns The result of the broadcast (transaction hash/result)
 */
export async function signAndSubmitTransaction(
  transactionXdr: string,
  signTransaction: (xdr: string) => Promise<string>
) {
  try {
    // 1. Sign the transaction
    // The signTransaction function from WalletContext handles the Freighter/Wallet interaction
    const signedXdr = await signTransaction(transactionXdr);

    if (!signedXdr) {
      throw new Error("Transaction signing was cancelled or failed");
    }

    // 2. Submit to Backend
    // Ideally the backend handles the submission to Horizon/RPC
    const result = await api.post<{ hash: string; status: string; result_xdr?: string }>('/rpc/broadcast', {
      transaction: signedXdr
    });

    return result;
  } catch (error: any) {
    console.error("Transaction failed:", error);
    // Extract meaningful error message if possible
    const message = error.response?.data?.error?.message || error.message || "Transaction submission failed";
    toast.error(message);
    throw new Error(message);
  }
}
