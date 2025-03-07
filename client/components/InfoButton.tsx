import React, { useState, useEffect, useRef } from "react";
import { IoIosInformationCircleOutline, IoMdClose } from "react-icons/io";

interface InfoButtonProps {
  message: string;
}

const InfoButton: React.FC<InfoButtonProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(false);
  const infoBoxRef = useRef<HTMLDivElement>(null);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      infoBoxRef.current &&
      !infoBoxRef.current.contains(event.target as Node)
    ) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleVisibility}
        className="cursor-pointer text-blue-500"
      >
        <IoIosInformationCircleOutline size={20} />
      </button>
      {isVisible && (
        <div
          ref={infoBoxRef}
          className="absolute top-0 left-full ml-2 bg-gray-800 text-white p-2 rounded shadow-lg z-10 w-48"
        >
          <button
            onClick={toggleVisibility}
            className="absolute top-0 right-0 mt-1 mr-1 cursor-pointer"
          >
            <IoMdClose size={20} />
          </button>
          {message}
        </div>
      )}
    </div>
  );
};

export default InfoButton;
