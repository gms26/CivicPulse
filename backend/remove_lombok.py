import os
import re

def generate_java_boilerplate(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # If no Lombok annotations, skip
    if not re.search(r'@(Data|Getter|Setter|Builder|NoArgsConstructor|AllArgsConstructor)', content):
        return False

    print(f"Processing {file_path}")

    # Remove Lombok imports
    content = re.sub(r'import lombok\..*?;\n', '', content)
    
    # Remove Lombok annotations
    content = re.sub(r'@(Data|Getter|Setter|Builder|NoArgsConstructor|AllArgsConstructor)\s*\n', '', content)
    
    # Also remove @ToString.Exclude which is Lombok
    content = re.sub(r'@ToString\.Exclude\s*\n', '', content)

    # Find the class name
    class_match = re.search(r'public class (\w+)(.*?)\s*\{', content)
    if not class_match:
        return False
    class_name = class_match.group(1)
    
    # Extract fields
    # Look for private/protected fields
    field_pattern = r'(private|protected)\s+([A-Za-z0-9_<>,\s]+)\s+([a-zA-Z0-9_]+)\s*(?:=[^;]+)?;'
    fields = re.findall(field_pattern, content)
    
    # Find the closing brace of the class
    last_brace_idx = content.rfind('}')
    
    if last_brace_idx != -1 and fields:
        boilerplate = "\n    // ==================== Boilerplate (Getters, Setters, Constructors, Builder) ====================\n\n"
        
        # NoArgs Constructor
        boilerplate += f"    public {class_name}() {{}}\n\n"
        
        # AllArgs Constructor
        args = ", ".join([f"{t.strip()} {n}" for _, t, n in fields])
        boilerplate += f"    public {class_name}({args}) {{\n"
        for _, _, n in fields:
            boilerplate += f"        this.{n} = {n};\n"
        boilerplate += "    }\n\n"
        
        # Getters and Setters
        for _, t, n in fields:
            t_clean = t.strip()
            # Title case for method name (handle boolean isX)
            cap_n = n[0].upper() + n[1:]
            
            # Getter
            prefix = "is" if t_clean == "boolean" and not n.startswith("is") else "get"
            if t_clean == "boolean" and n.startswith("is"):
                getter_name = n
            else:
                getter_name = f"{prefix}{cap_n}"
                
            boilerplate += f"    public {t_clean} {getter_name}() {{\n        return {n};\n    }}\n\n"
            
            # Setter
            setter_name = f"set{cap_n}"
            if t_clean == "boolean" and n.startswith("is"):
                setter_name = "set" + n[2:]
            
            boilerplate += f"    public void {setter_name}({t_clean} {n}) {{\n        this.{n} = {n};\n    }}\n\n"

        # Builder
        boilerplate += f"    public static {class_name}Builder builder() {{\n        return new {class_name}Builder();\n    }}\n\n"
        boilerplate += f"    public static class {class_name}Builder {{\n"
        for _, t, n in fields:
            boilerplate += f"        private {t.strip()} {n};\n"
        boilerplate += "\n"
        for _, t, n in fields:
            boilerplate += f"        public {class_name}Builder {n}({t.strip()} {n}) {{\n            this.{n} = {n};\n            return this;\n        }}\n\n"
        boilerplate += f"        public {class_name} build() {{\n"
        args_call = ", ".join([n for _, _, n in fields])
        boilerplate += f"            return new {class_name}({args_call});\n"
        boilerplate += "        }\n"
        boilerplate += "    }\n"
        
        # Insert boilerplate before the last brace
        content = content[:last_brace_idx] + boilerplate + content[last_brace_idx:]
        
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
        
    return True

def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.java'):
                file_path = os.path.join(root, file)
                generate_java_boilerplate(file_path)

if __name__ == '__main__':
    src_dir = r'd:\civic\backend\src\main\java\com\civicpulse'
    process_directory(src_dir)
