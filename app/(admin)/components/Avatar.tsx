import Image from "next/image"
import { createAvatar } from "@dicebear/core"
import { rings } from "@dicebear/collection"


function Avatar({ seed, className} : { seed: string, className?: string }) {
  
    const avatar = createAvatar(rings, {
        seed,
    });

    const svg = avatar.toString();

    const dataUrl = `data:Image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  return (
    <Image 
    src={dataUrl}
    alt ='avatar'
    width={100}
    height={100}
    className={className} 
    
    
    
    />
  )
}
export default Avatar



// building the avatar that we will export
// and import and place into the header file 