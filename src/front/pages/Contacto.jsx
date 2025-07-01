import React from "react";
import { useNavigate } from "react-router-dom";


export default function Contacto() {
  const navigate = useNavigate();

  const redirectHome = () => {
    navigate("/");
  };


  return (
    <div className="bg-transparent flex flex-row justify-center w-full">
      <div className="w-[1409px] h-[748px] relative">
        <Card className="w-full h-full border-none">
          <CardContent className="p-0 flex items-center justify-between">
            <div className="flex flex-col space-y-4 p-8 max-w-md">
              <h2 className="text-lg font-medium">
                ¡Estamos A Un Correo De Distancia!
              </h2>
              <p className="text-muted-foreground">Envíanos Tus Dudas A:</p>
              <a
                href="mailto:trueketeo@gmail.com"
                className="text-primary font-medium hover:underline"
              >
                trueketeo@gmail.com
              </a>
              <p className="text-muted-foreground">
                Y Con Gusto Te Ayudaremos.
              </p>

              <div onClick={redirectHome}>
                <Button className="bg-[#9370DB] hover:bg-[#8A5FDB] text-black w-fit mt-4">
                  Trueketeo
                </Button>
              </div>
            </div>

            <div className="relative flex-1 h-full">
              <img
                className="object-contain"
                alt="Customer support representative at desk with computer"
                src="/desktop-3.png"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
