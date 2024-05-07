import { FullSlug, TransformOptions, transformLink} from "../util/path"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import  style from "./styles/properties.scss"

var propertiesExcluded = ["draft","tags","title"] // Add properties you want to ignore here

function createLinkedElement(fileData: any, opts : any, value: string) {
  let cleanedValue = value.replace(/['"\[\]]+/g, '')
  let href = transformLink(fileData.slug!, cleanedValue, opts)

  return (
    <a  href={href} class="internal">{cleanedValue}</a>
  )
}

function createPropertyElement(key: string, value: any) {
  return(
    <li>
      <span class="property">{key}</span> : <span class="value">{value}</span>
    </li>
  )
}

function stringifyValues(strs: any) {
    var valueArray: string[] = [];
    if (strs && typeof strs === "object") {
      for (const s of strs) {
        valueArray.push(s);
      }
    } 
    else if (typeof strs === "string") {
        valueArray.push(strs);
    }
    return valueArray;
}

export default (() => {
  function PropertiesWithWorkingLinks({fileData, allFiles}: QuartzComponentProps, ) {
    const opts: TransformOptions = {
      strategy: "shortest",
      allSlugs: allFiles.map((fp) => fp.slug as FullSlug)
    }

    var propertiesElements = []

    if(Object.keys(fileData.frontmatter ?? {}).length > 0){
      for(const [key, value] of Object.entries(fileData.frontmatter ?? {})) {
        if(!propertiesExcluded.includes(key)){
          var linkedElements = []
          var valueStringArray = stringifyValues(value);

          if (valueStringArray.length > 0){
            for(let i=0; i < valueStringArray.length; i++){
                if(valueStringArray[i].includes("[[")){
                    if(i > 0){
                        linkedElements.push(", ")
                    }
                    linkedElements.push(createLinkedElement(fileData, opts, valueStringArray[i]))
                }
                else{
                    linkedElements.push(valueStringArray[i])
                }
            }
          }
        propertiesElements.push(createPropertyElement(key, linkedElements))
      }

      }
    }

    return (      
      <div class="properties">
        <ul>{propertiesElements}</ul>
      </div>
    )

  }

    PropertiesWithWorkingLinks.css = style
    return PropertiesWithWorkingLinks

  }
) satisfies QuartzComponentConstructor

/* Credit to both https://github.com/gamberoillecito for their author and nextnote from which I built this and to https://github.com/jackyzha0 both the creator and gracious question answerer*/