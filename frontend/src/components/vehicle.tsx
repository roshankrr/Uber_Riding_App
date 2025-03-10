export const Vehicle = ({ fares, setVehicle_type }: any) => {
  return (
    <div className="flex flex-col gap-6 mt-6">
      {[
        {
          type: "bike",
          price: fares.bike.toFixed(2),
          capacity: "1 person",
          time: "3 min away",
          image:
            "data:image/png;base64,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",
        },
        {
          type: "car",
          price: fares.car.toFixed(2),
          capacity: "4 people",
          time: "4 min away",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwHf8BepeTip7WrWM1paQEclZCUoj5-nj5dw&s",
        },
        {
          type: "auto",
          price: fares.auto.toFixed(2),
          capacity: "3 people",
          time: "5 min away",
          image:
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT78pEO29ec5EGaYWRgzCSHpzGXDe5YKFOqxQ&s",
        },
      ].map((option, index) => (
        <div
          key={index}
          className="flex items-center p-4 border border-gray-300 rounded-lg shadow-md transition-transform transform hover:scale-105 cursor-pointer"
          onClick={(e) => {
            const selected = e.currentTarget;
            const siblings = selected.parentNode?.children;
            if (siblings) {
              for (let sibling of siblings) {
                sibling.classList.remove("bg-gray-300");
              }
              selected.classList.add("bg-gray-300");
              setVehicle_type(option.type);
            }
          }}
        >
          <img
            src={option.image}
            alt={option.type}
            className="w-16 h-16 mr-4 rounded-full border border-gray-200"
          />
          <div className="flex flex-col flex-grow">
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">{option.type}</span>
              <span className="text-xl text-green-600">{option.price}</span>
            </div>
            <div className="flex flex-col text-gray-600">
              <span>{option.capacity}</span>
              <span>{option.time}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
