import fs from 'fs';

function updateCards(filePath, type) {
  let content = fs.readFileSync(filePath, 'utf-8');

  // We are going to replace the grid layout cards with vertical layout cards.
  if (type === 'org') {
    const cardStart = content.indexOf('<div key={org.id} className="group grid gap-0');
    if (cardStart === -1) return;
    const endStr = '</div>\n              </div>\n            );\n          })}\n        </div>';
    const cardEnd = content.indexOf(endStr, cardStart) + endStr.length;

    const newCards = `<div key={org.id} className="group premium-card campus-frame overflow-hidden flex flex-col relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)] h-[420px]">
                {/* Org Card Ring */}
                <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block pointer-events-none z-0">
                  <CardRing size={400} text="ORGANIZATION • COLLECTIVE • ORGANIZATION • " />
                </div>

                {/* Fixed Height Image */}
                <Link href={\`/org/\${org.slug}\`} className="block h-48 shrink-0 overflow-hidden bg-g1 relative border-b border-[#1a1a1a] z-10">
                  <img 
                    src={banner} 
                    alt={org.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </Link>

                {/* Feature Content */}
                <div className="flex flex-col flex-1 p-6 relative z-10">
                  <div className="flex items-center gap-3 mono text-[10px] uppercase tracking-[0.25em] font-medium text-[var(--brand)] mb-3">
                    <span>(0{index + 1})</span>
                    <span>•</span>
                    <span className="truncate">{org.industry || "Ecosystem Hub"}</span>
                  </div>

                  <Link href={\`/org/\${org.slug}\`} className="block mb-2">
                    <h3 className="serif text-2xl leading-tight text-ink group-hover:text-[var(--brand)] transition-colors font-light truncate">
                      {org.name}
                    </h3>
                  </Link>

                  <p className="text-g5 text-[13px] leading-[1.6] font-sans line-clamp-2 flex-1">
                    {org.description || "A collective group of makers and builders shaping technology on campus."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-g3/50 flex items-center justify-between text-[12px] font-sans text-g5">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{org.members.length}</span> Members
                    </div>
                    <div className="flex items-center gap-1.5 truncate max-w-[120px]">
                      <span>{org.location || "Remote"}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>`;
    content = content.substring(0, cardStart) + newCards + content.substring(cardEnd);
    
    // Also fix grid container
    content = content.replace(/<div className="grid grid-cols-1 gap-6 mt-10 relative z-10">/, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">');
    
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);

  } else if (type === 'spaces') {
    const cardStart = content.indexOf('<div key={space.id} className="group grid gap-0');
    if (cardStart === -1) return;
    const endStr = '</div>\n              </div>\n            );\n          })}\n        </div>';
    const cardEnd = content.indexOf(endStr, cardStart) + endStr.length;

    const newCards = `<div key={space.id} className="group premium-card campus-frame overflow-hidden flex flex-col relative border border-[#1a1a1a] hover:border-[#2f2f2f] transition-all duration-700 hover:-translate-y-[2px] ease-[cubic-bezier(0.22,0.61,0.36,1)] h-[420px]">
                {/* Space Card Ring */}
                <div className="absolute -right-[15%] top-1/2 -translate-y-1/2 opacity-8 group-hover:opacity-25 transition-opacity duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)] hidden md:block pointer-events-none z-0">
                  <CardRing size={400} text="SPACE • DIGITAL CAMPUS • SPACE • " />
                </div>

                {/* Fixed Height Image */}
                <Link href={\`/spaces/\${space.id}\`} className="block h-48 shrink-0 overflow-hidden bg-g1 relative border-b border-[#1a1a1a] z-10">
                  <img 
                    src={banner} 
                    alt={space.name} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                </Link>

                {/* Feature Content */}
                <div className="flex flex-col flex-1 p-6 relative z-10">
                  <div className="flex items-center gap-3 mono text-[10px] uppercase tracking-[0.25em] font-medium text-[var(--brand)] mb-3">
                    <span>(0{index + 1})</span>
                    <span>•</span>
                    <span className="truncate">{space.organization.name}</span>
                  </div>

                  <Link href={\`/spaces/\${space.id}\`} className="block mb-2">
                    <h3 className="serif text-2xl leading-tight text-ink group-hover:text-[var(--brand)] transition-colors font-light truncate">
                      {space.name}
                    </h3>
                  </Link>

                  <p className="text-g5 text-[13px] leading-[1.6] font-sans line-clamp-2 flex-1">
                    {space.description || "A collaborative circle gathered on the Convoke digital campus."}
                  </p>

                  <div className="mt-4 pt-4 border-t border-g3/50 flex items-center justify-between text-[12px] font-sans text-g5">
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{space.organization.members.length}</span> Builders
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-ink font-medium">{space._count.messages}</span> Dispatches
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>`;
    content = content.substring(0, cardStart) + newCards + content.substring(cardEnd);
    
    // Also fix grid container
    content = content.replace(/<div className="grid grid-cols-1 gap-6 mt-10 relative z-10">/, '<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 relative z-10">');
    
    fs.writeFileSync(filePath, content);
    console.log("Updated", filePath);
  }
}

updateCards('src/app/organizations/OrganizationsList.tsx', 'org');
updateCards('src/app/spaces/SpacesList.tsx', 'spaces');
