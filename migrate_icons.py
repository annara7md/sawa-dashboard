import os
import re

mapping = {
  "Home.tsx": ("HomeIcon", "interface-essential-home-3.svg"),
  "Products.tsx": ("ProductsIcon", "money-shopping-shopping-bag.svg"),
  "Orders.tsx": ("OrdersIcon", "money-shopping-receipt.svg"),
  "Customers.tsx": ("CustomersIcon", "interface-essential-user-multiple-group.svg"),
  "Discounts.tsx": ("DiscountsIcon", "money-shopping-discount-percent-badge.svg"),
  "Modeling.tsx": ("ModelingIcon", "programming-module-puzzle-1.svg"),
  "Translations.tsx": ("TranslationsIcon", "work-education-dictionary-language-book.svg"),
  "Marketplace.tsx": ("MarketplaceIcon", "money-shopping-store-1.svg"),
  "Configuration.tsx": ("ConfigurationIcon", "interface-essential-cog.svg"),
}

target_dir = "/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/icons"
source_dir = "/Users/fahmifareed/Documents/sawa-main/sawa-dashboard/src/icons/core-flat"

replace_props = {
    'fill-rule': 'fillRule',
    'clip-rule': 'clipRule',
    'stroke-width': 'strokeWidth',
    'stroke-linecap': 'strokeLinecap',
    'stroke-linejoin': 'strokeLinejoin',
    'stroke-dasharray': 'strokeDasharray',
    'stroke-dashoffset': 'strokeDashoffset',
    'stroke-opacity': 'strokeOpacity',
    'stroke-miterlimit': 'strokeMiterlimit',
    'class': 'className',
}

for tsx_file, (export_name, svg_file) in mapping.items():
    svg_path = os.path.join(source_dir, svg_file)
    tsx_path = os.path.join(target_dir, tsx_file)
    
    if not os.path.exists(svg_path):
        print(f"SVG not found: {svg_path}")
        continue
        
    with open(svg_path, "r", encoding="utf-8") as f:
        svg_content = f.read()
        
    viewbox_match = re.search(r'viewBox="([^"]+)"', svg_content)
    viewbox = viewbox_match.group(1) if viewbox_match else "0 0 14 14"
    
    inner_match = re.search(r'<svg[^>]*>(.*?)</svg>', svg_content, re.DOTALL | re.IGNORECASE)
    inner_content = inner_match.group(1) if inner_match else ""
    
    inner_content = re.sub(r'<desc>.*?</desc>', '', inner_content, flags=re.DOTALL)
    
    for attr, react_prop in replace_props.items():
        inner_content = re.sub(fr'\b{attr}=', f'{react_prop}=', inner_content)
        
    inner_content = inner_content.strip()
    
    if tsx_file == "Modeling.tsx":
        react_code = f"""const ModelingIcon = () => (
  <svg viewBox="{viewbox}" fill="none" xmlns="http://www.w3.org/2000/svg" data-macaw-ui-candidate width="20" height="20">
    {inner_content}
  </svg>
);

export default ModelingIcon;
"""
    else:
        react_code = f"""export const {export_name} = () => (
  <svg viewBox="{viewbox}" fill="none" xmlns="http://www.w3.org/2000/svg" data-macaw-ui-candidate width="20" height="20">
    {inner_content}
  </svg>
);
"""

    with open(tsx_path, "w", encoding="utf-8") as f:
        f.write(react_code)
        
    print(f"✅ Updated {tsx_file} with {svg_file}")
