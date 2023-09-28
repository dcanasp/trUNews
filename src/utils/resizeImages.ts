import Sharp from 'sharp'

export async function resizeImages(imageBuffer:Buffer,ancho:number,ratio:string){
    
    const ratioSeparado = ratio.split(':');

    return await Sharp(imageBuffer).resize({
      width: Math.round( ancho * parseInt(ratioSeparado[0]) ),
      height: Math.round( ancho *parseInt(ratioSeparado[1]) ),
      fit: Sharp.fit.cover, 
    }).toBuffer();

} 


export async function convertBase64(imageBuffer:Buffer){
    
  const base64String = imageBuffer.toString('base64');
  return base64String;

} 