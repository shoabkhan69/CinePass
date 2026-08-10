import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ColorModeProvider } from "./context/ColorModeContext";
import { AuthProvider } from "./context/AuthContext";
import { BookingDraftProvider } from "./context/BookingDraftContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <ColorModeProvider>
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <AuthProvider>
          <BookingDraftProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </BookingDraftProvider>
        </AuthProvider>
      </SnackbarProvider>
    </ColorModeProvider>
  );
}
