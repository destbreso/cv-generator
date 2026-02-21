"use client";

import { useState } from "react";
import { useCVStore } from "@/lib/cv-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderKanban,
  Award,
  Upload,
  Download,
  BookOpen,
  Languages,
  Heart,
  HandHeart,
  Trophy,
  Beaker,
  Eraser,
  Linkedin,
  FileText,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LinkedInImportDialog } from "@/components/linkedin-import-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CVEditorPanel() {
  const { state, dispatch, updateField, setCVData } = useCVStore();
  const { cvData } = state;

  const [pdfImportOpen, setPdfImportOpen] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    summary: true,
    experience: false,
    education: false,
    skills: false,
    languages: false,
    projects: false,
    certifications: false,
    publications: false,
    volunteerWork: false,
    awards: false,
    interests: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            setCVData(data);
          } catch {
            console.error("Invalid JSON file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(cvData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `cv-data-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Compact action toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Your Profile</h2>
        <div className="flex items-center gap-1">
          {/* Import dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Upload className="h-3.5 w-3.5" />
                Import
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setPdfImportOpen(true)}
                className="gap-2"
              >
                <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                <div className="flex flex-col">
                  <span className="flex items-center gap-1.5">
                    LinkedIn PDF
                    <Sparkles className="h-3 w-3 text-amber-500" />
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    AI extracts your profile data
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setPdfImportOpen(true)}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>Any Resume PDF</span>
                  <span className="text-[11px] text-muted-foreground">
                    AI extracts from any PDF
                  </span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleImport} className="gap-2">
                <Upload className="h-4 w-4" />
                <div className="flex flex-col">
                  <span>JSON File</span>
                  <span className="text-[11px] text-muted-foreground">
                    Import a CV data backup
                  </span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Secondary actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => dispatch({ type: "LOAD_SAMPLE_DATA" })}
                className="gap-2"
              >
                <Beaker className="h-4 w-4" />
                Load Sample Data
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export as JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => dispatch({ type: "CLEAR_DATA" })}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Eraser className="h-4 w-4" />
                Clear All Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PDF Import dialog (controlled externally) */}
      <LinkedInImportDialog
        externalOpen={pdfImportOpen}
        onExternalOpenChange={setPdfImportOpen}
      />

      {/* ── Personal Info ── */}
      <CollapsibleSection
        title="Personal Information"
        icon={User}
        isOpen={openSections.personal}
        onToggle={() => toggleSection("personal")}
        badge={cvData.personalInfo.name ? "Complete" : "Incomplete"}
        badgeVariant={cvData.personalInfo.name ? "default" : "outline"}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={cvData.personalInfo.name}
              onChange={(e) => updateField("personalInfo.name", e.target.value)}
              placeholder="Alex Rivera"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="title">Professional Title</Label>
            <Input
              id="title"
              value={cvData.personalInfo.title || ""}
              onChange={(e) =>
                updateField("personalInfo.title", e.target.value)
              }
              placeholder="Senior Full-Stack Engineer"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={cvData.personalInfo.email}
              onChange={(e) =>
                updateField("personalInfo.email", e.target.value)
              }
              placeholder="alex@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={cvData.personalInfo.phone}
              onChange={(e) =>
                updateField("personalInfo.phone", e.target.value)
              }
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={cvData.personalInfo.location}
              onChange={(e) =>
                updateField("personalInfo.location", e.target.value)
              }
              placeholder="San Francisco, CA"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={cvData.personalInfo.website || ""}
              onChange={(e) =>
                updateField("personalInfo.website", e.target.value)
              }
              placeholder="https://alexrivera.dev"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={cvData.personalInfo.linkedin || ""}
              onChange={(e) =>
                updateField("personalInfo.linkedin", e.target.value)
              }
              placeholder="linkedin.com/in/alexrivera"
            />
          </div>
          <div>
            <Label htmlFor="github">GitHub</Label>
            <Input
              id="github"
              value={cvData.personalInfo.github || ""}
              onChange={(e) =>
                updateField("personalInfo.github", e.target.value)
              }
              placeholder="github.com/alexrivera"
            />
          </div>
          <div className="col-span-2">
            <Label htmlFor="portfolio">Portfolio</Label>
            <Input
              id="portfolio"
              value={cvData.personalInfo.portfolio || ""}
              onChange={(e) =>
                updateField("personalInfo.portfolio", e.target.value)
              }
              placeholder="https://portfolio.alexrivera.dev"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* ── Summary ── */}
      <CollapsibleSection
        title="Professional Summary"
        icon={User}
        isOpen={openSections.summary}
        onToggle={() => toggleSection("summary")}
        badge={cvData.summary ? `${cvData.summary.length} chars` : "Empty"}
        badgeVariant={cvData.summary ? "default" : "outline"}
      >
        <Textarea
          value={cvData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          placeholder="Write a compelling summary of your professional background..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-muted-foreground mt-2">
          Tip: Keep it between 150-300 characters for optimal impact.
        </p>
      </CollapsibleSection>

      {/* ── Experience ── */}
      <CollapsibleSection
        title="Work Experience"
        icon={Briefcase}
        isOpen={openSections.experience}
        onToggle={() => toggleSection("experience")}
        badge={`${cvData.experience.length} entries`}
        onAdd={() => {
          const newExp = {
            id: Date.now().toString(),
            company: "",
            position: "",
            startDate: "",
            endDate: "",
            description: "",
            achievements: [],
          };
          updateField("experience", [...cvData.experience, newExp]);
        }}
      >
        <div className="space-y-4">
          {cvData.experience.map((exp, index) => (
            <ExperienceItem
              key={exp.id}
              experience={exp}
              onUpdate={(updated) => {
                const arr = [...cvData.experience];
                arr[index] = updated;
                updateField("experience", arr);
              }}
              onDelete={() =>
                updateField(
                  "experience",
                  cvData.experience.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.experience.length === 0 && (
            <EmptyHint>No experience added yet. Click + to add one.</EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Education ── */}
      <CollapsibleSection
        title="Education"
        icon={GraduationCap}
        isOpen={openSections.education}
        onToggle={() => toggleSection("education")}
        badge={`${cvData.education.length} entries`}
        onAdd={() => {
          updateField("education", [
            ...cvData.education,
            {
              id: Date.now().toString(),
              institution: "",
              degree: "",
              field: "",
              startDate: "",
              endDate: "",
            },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.education.map((edu, index) => (
            <EducationItem
              key={edu.id}
              education={edu}
              onUpdate={(updated) => {
                const arr = [...cvData.education];
                arr[index] = updated;
                updateField("education", arr);
              }}
              onDelete={() =>
                updateField(
                  "education",
                  cvData.education.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.education.length === 0 && (
            <EmptyHint>No education added yet. Click + to add one.</EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Skills ── */}
      <CollapsibleSection
        title="Skills"
        icon={Code}
        isOpen={openSections.skills}
        onToggle={() => toggleSection("skills")}
        badge={`${cvData.skills.length} categories`}
        onAdd={() => {
          updateField("skills", [
            ...cvData.skills,
            { id: Date.now().toString(), category: "", items: [] },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.skills.map((skill, index) => (
            <SkillItem
              key={skill.id}
              skill={skill}
              onUpdate={(updated) => {
                const arr = [...cvData.skills];
                arr[index] = updated;
                updateField("skills", arr);
              }}
              onDelete={() =>
                updateField(
                  "skills",
                  cvData.skills.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.skills.length === 0 && (
            <EmptyHint>
              No skills added yet. Click + to add a category (e.g. Technical
              Skills, Soft Skills).
            </EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Languages ── */}
      <CollapsibleSection
        title="Languages"
        icon={Languages}
        isOpen={openSections.languages}
        onToggle={() => toggleSection("languages")}
        badge={`${cvData.languages.length} languages`}
        onAdd={() => {
          updateField("languages", [
            ...cvData.languages,
            {
              id: Date.now().toString(),
              language: "",
              proficiency: "intermediate" as const,
            },
          ]);
        }}
      >
        <div className="space-y-3">
          {cvData.languages.map((lang, index) => (
            <LanguageItem
              key={lang.id}
              language={lang}
              onUpdate={(updated) => {
                const arr = [...cvData.languages];
                arr[index] = updated;
                updateField("languages", arr);
              }}
              onDelete={() =>
                updateField(
                  "languages",
                  cvData.languages.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.languages.length === 0 && (
            <EmptyHint>No languages added yet. Click + to add one.</EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Projects ── */}
      <CollapsibleSection
        title="Projects"
        icon={FolderKanban}
        isOpen={openSections.projects}
        onToggle={() => toggleSection("projects")}
        badge={`${cvData.projects.length} projects`}
        onAdd={() => {
          updateField("projects", [
            ...cvData.projects,
            {
              id: Date.now().toString(),
              name: "",
              description: "",
              technologies: [],
            },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.projects.map((project, index) => (
            <ProjectItem
              key={project.id}
              project={project}
              onUpdate={(updated) => {
                const arr = [...cvData.projects];
                arr[index] = updated;
                updateField("projects", arr);
              }}
              onDelete={() =>
                updateField(
                  "projects",
                  cvData.projects.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.projects.length === 0 && (
            <EmptyHint>No projects added yet. Click + to add one.</EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Certifications ── */}
      <CollapsibleSection
        title="Certifications"
        icon={Award}
        isOpen={openSections.certifications}
        onToggle={() => toggleSection("certifications")}
        badge={`${cvData.certifications.length} certs`}
        onAdd={() => {
          updateField("certifications", [
            ...cvData.certifications,
            { id: Date.now().toString(), name: "", issuer: "", date: "" },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.certifications.map((cert, index) => (
            <CertificationItem
              key={cert.id}
              certification={cert}
              onUpdate={(updated) => {
                const arr = [...cvData.certifications];
                arr[index] = updated;
                updateField("certifications", arr);
              }}
              onDelete={() =>
                updateField(
                  "certifications",
                  cvData.certifications.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.certifications.length === 0 && (
            <EmptyHint>
              No certifications added yet. Click + to add one.
            </EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Publications ── */}
      <CollapsibleSection
        title="Publications"
        icon={BookOpen}
        isOpen={openSections.publications}
        onToggle={() => toggleSection("publications")}
        badge={`${cvData.publications.length} publications`}
        onAdd={() => {
          updateField("publications", [
            ...cvData.publications,
            {
              id: Date.now().toString(),
              title: "",
              publisher: "",
              date: "",
              url: "",
              description: "",
            },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.publications.map((pub, index) => (
            <PublicationItem
              key={pub.id}
              publication={pub}
              onUpdate={(updated) => {
                const arr = [...cvData.publications];
                arr[index] = updated;
                updateField("publications", arr);
              }}
              onDelete={() =>
                updateField(
                  "publications",
                  cvData.publications.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.publications.length === 0 && (
            <EmptyHint>
              No publications added yet. Click + to add one.
            </EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Volunteer Work ── */}
      <CollapsibleSection
        title="Volunteer Work"
        icon={HandHeart}
        isOpen={openSections.volunteerWork}
        onToggle={() => toggleSection("volunteerWork")}
        badge={`${cvData.volunteerWork.length} entries`}
        onAdd={() => {
          updateField("volunteerWork", [
            ...cvData.volunteerWork,
            {
              id: Date.now().toString(),
              organization: "",
              role: "",
              startDate: "",
              endDate: "",
              description: "",
            },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.volunteerWork.map((vol, index) => (
            <VolunteerItem
              key={vol.id}
              volunteer={vol}
              onUpdate={(updated) => {
                const arr = [...cvData.volunteerWork];
                arr[index] = updated;
                updateField("volunteerWork", arr);
              }}
              onDelete={() =>
                updateField(
                  "volunteerWork",
                  cvData.volunteerWork.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.volunteerWork.length === 0 && (
            <EmptyHint>
              No volunteer work added yet. Click + to add one.
            </EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Awards ── */}
      <CollapsibleSection
        title="Awards & Honors"
        icon={Trophy}
        isOpen={openSections.awards}
        onToggle={() => toggleSection("awards")}
        badge={`${cvData.awards.length} awards`}
        onAdd={() => {
          updateField("awards", [
            ...cvData.awards,
            {
              id: Date.now().toString(),
              title: "",
              issuer: "",
              date: "",
              description: "",
            },
          ]);
        }}
      >
        <div className="space-y-4">
          {cvData.awards.map((award, index) => (
            <AwardItem
              key={award.id}
              award={award}
              onUpdate={(updated) => {
                const arr = [...cvData.awards];
                arr[index] = updated;
                updateField("awards", arr);
              }}
              onDelete={() =>
                updateField(
                  "awards",
                  cvData.awards.filter((_, i) => i !== index),
                )
              }
            />
          ))}
          {cvData.awards.length === 0 && (
            <EmptyHint>No awards added yet. Click + to add one.</EmptyHint>
          )}
        </div>
      </CollapsibleSection>

      {/* ── Interests ── */}
      <CollapsibleSection
        title="Interests"
        icon={Heart}
        isOpen={openSections.interests}
        onToggle={() => toggleSection("interests")}
        badge={`${cvData.interests.length} interests`}
      >
        <InterestsEditor
          interests={cvData.interests}
          onChange={(updated) => updateField("interests", updated)}
        />
      </CollapsibleSection>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Shared Components
   ═══════════════════════════════════════════════ */

function EmptyHint({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground text-center py-4">{children}</p>
  );
}

/* ── Collapsible Section ── */

interface CollapsibleSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  badge?: string;
  badgeVariant?: "default" | "outline" | "secondary";
  onAdd?: () => void;
}

function CollapsibleSection({
  title,
  icon: Icon,
  isOpen,
  onToggle,
  children,
  badge,
  badgeVariant = "secondary",
  onAdd,
}: CollapsibleSectionProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <Card>
        <CardHeader className="py-3 px-4">
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between cursor-pointer group">
              <div className="flex items-center gap-3">
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
                <Icon className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {badge && (
                  <Badge variant={badgeVariant} className="text-xs">
                    {badge}
                  </Badge>
                )}
                {onAdd && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={(e) => {
                      e.stopPropagation();
                      onAdd();
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 px-4 pb-4">{children}</CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

/* ── Delete button helper ── */

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8 text-destructive shrink-0"
      onClick={onClick}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}

/* ── Tag input helper ── */

function TagInput({
  tags,
  onChange,
  placeholder,
  label,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
  label: string;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    if (input.trim()) {
      onChange([...tags, input.trim()]);
      setInput("");
    }
  };

  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <div className="flex gap-2 mb-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          className="h-8 text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button variant="outline" size="sm" className="h-8" onClick={add}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-1">
        {tags.map((tag, i) => (
          <Badge
            key={i}
            variant="secondary"
            className="text-xs cursor-pointer"
            onClick={() => onChange(tags.filter((_, j) => j !== i))}
          >
            {tag} ×
          </Badge>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   Item Components
   ═══════════════════════════════════════════════ */

/* ── Experience ── */

function ExperienceItem({
  experience,
  onUpdate,
  onDelete,
}: {
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    achievements: string[];
  };
  onUpdate: (e: typeof experience) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2 mb-3">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Company</Label>
            <Input
              value={experience.company}
              onChange={(e) =>
                onUpdate({ ...experience, company: e.target.value })
              }
              placeholder="Company name"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Position</Label>
            <Input
              value={experience.position}
              onChange={(e) =>
                onUpdate({ ...experience, position: e.target.value })
              }
              placeholder="Job title"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Start Date</Label>
            <Input
              value={experience.startDate}
              onChange={(e) =>
                onUpdate({ ...experience, startDate: e.target.value })
              }
              placeholder="Jan 2020"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input
              value={experience.endDate}
              onChange={(e) =>
                onUpdate({ ...experience, endDate: e.target.value })
              }
              placeholder="Present"
              className="h-8 text-sm"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={experience.description}
              onChange={(e) =>
                onUpdate({ ...experience, description: e.target.value })
              }
              placeholder="Brief description of your role..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <div className="col-span-2">
            <TagInput
              tags={experience.achievements}
              onChange={(achievements) =>
                onUpdate({ ...experience, achievements })
              }
              placeholder="Add an achievement..."
              label="Achievements"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Education ── */

function EducationItem({
  education,
  onUpdate,
  onDelete,
}: {
  education: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  };
  onUpdate: (e: typeof education) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Institution</Label>
            <Input
              value={education.institution}
              onChange={(e) =>
                onUpdate({ ...education, institution: e.target.value })
              }
              placeholder="University name"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Degree</Label>
            <Input
              value={education.degree}
              onChange={(e) =>
                onUpdate({ ...education, degree: e.target.value })
              }
              placeholder="Bachelor's"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Field of Study</Label>
            <Input
              value={education.field}
              onChange={(e) =>
                onUpdate({ ...education, field: e.target.value })
              }
              placeholder="Computer Science"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Start Year</Label>
            <Input
              value={education.startDate}
              onChange={(e) =>
                onUpdate({ ...education, startDate: e.target.value })
              }
              placeholder="2016"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">End Year</Label>
            <Input
              value={education.endDate}
              onChange={(e) =>
                onUpdate({ ...education, endDate: e.target.value })
              }
              placeholder="2020"
              className="h-8 text-sm"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Skills ── */

function SkillItem({
  skill,
  onUpdate,
  onDelete,
}: {
  skill: { id: string; category: string; items: string[] };
  onUpdate: (s: typeof skill) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 space-y-3">
          <div>
            <Label className="text-xs">Category</Label>
            <Input
              value={skill.category}
              onChange={(e) => onUpdate({ ...skill, category: e.target.value })}
              placeholder="e.g. Technical Skills, Soft Skills, DevOps"
              className="h-8 text-sm"
            />
          </div>
          <TagInput
            tags={skill.items}
            onChange={(items) => onUpdate({ ...skill, items })}
            placeholder="Add a skill..."
            label="Skills"
          />
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Languages ── */

function LanguageItem({
  language,
  onUpdate,
  onDelete,
}: {
  language: {
    id: string;
    language: string;
    proficiency: "native" | "fluent" | "advanced" | "intermediate" | "basic";
  };
  onUpdate: (l: typeof language) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-3 bg-muted/30">
      <div className="flex items-center gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Language</Label>
            <Input
              value={language.language}
              onChange={(e) =>
                onUpdate({ ...language, language: e.target.value })
              }
              placeholder="English"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Proficiency</Label>
            <Select
              value={language.proficiency}
              onValueChange={(v) =>
                onUpdate({
                  ...language,
                  proficiency: v as typeof language.proficiency,
                })
              }
            >
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="native">Native</SelectItem>
                <SelectItem value="fluent">Fluent</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Projects ── */

function ProjectItem({
  project,
  onUpdate,
  onDelete,
}: {
  project: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
    url?: string;
  };
  onUpdate: (p: typeof project) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) => onUpdate({ ...project, name: e.target.value })}
                placeholder="Project name"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">URL (optional)</Label>
              <Input
                value={project.url || ""}
                onChange={(e) => onUpdate({ ...project, url: e.target.value })}
                placeholder="https://..."
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description</Label>
            <Textarea
              value={project.description}
              onChange={(e) =>
                onUpdate({ ...project, description: e.target.value })
              }
              placeholder="Brief project description..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
          <TagInput
            tags={project.technologies}
            onChange={(technologies) => onUpdate({ ...project, technologies })}
            placeholder="Add technology..."
            label="Technologies"
          />
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Certifications ── */

function CertificationItem({
  certification,
  onUpdate,
  onDelete,
}: {
  certification: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
  };
  onUpdate: (c: typeof certification) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Certification Name</Label>
            <Input
              value={certification.name}
              onChange={(e) =>
                onUpdate({ ...certification, name: e.target.value })
              }
              placeholder="AWS Certified Solutions Architect"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Issuing Organization</Label>
            <Input
              value={certification.issuer}
              onChange={(e) =>
                onUpdate({ ...certification, issuer: e.target.value })
              }
              placeholder="Amazon Web Services"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input
              value={certification.date}
              onChange={(e) =>
                onUpdate({ ...certification, date: e.target.value })
              }
              placeholder="Jan 2023"
              className="h-8 text-sm"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Publications ── */

function PublicationItem({
  publication,
  onUpdate,
  onDelete,
}: {
  publication: {
    id: string;
    title: string;
    publisher: string;
    date: string;
    url?: string;
    description?: string;
  };
  onUpdate: (p: typeof publication) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Label className="text-xs">Title</Label>
              <Input
                value={publication.title}
                onChange={(e) =>
                  onUpdate({ ...publication, title: e.target.value })
                }
                placeholder="Article or paper title"
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Publisher</Label>
              <Input
                value={publication.publisher}
                onChange={(e) =>
                  onUpdate({ ...publication, publisher: e.target.value })
                }
                placeholder="Journal, blog, conference..."
                className="h-8 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Date</Label>
              <Input
                value={publication.date}
                onChange={(e) =>
                  onUpdate({ ...publication, date: e.target.value })
                }
                placeholder="Sep 2023"
                className="h-8 text-sm"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">URL (optional)</Label>
              <Input
                value={publication.url || ""}
                onChange={(e) =>
                  onUpdate({ ...publication, url: e.target.value })
                }
                placeholder="https://..."
                className="h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs">Description (optional)</Label>
            <Textarea
              value={publication.description || ""}
              onChange={(e) =>
                onUpdate({ ...publication, description: e.target.value })
              }
              placeholder="Brief description of the publication..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Volunteer Work ── */

function VolunteerItem({
  volunteer,
  onUpdate,
  onDelete,
}: {
  volunteer: {
    id: string;
    organization: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
  };
  onUpdate: (v: typeof volunteer) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Organization</Label>
            <Input
              value={volunteer.organization}
              onChange={(e) =>
                onUpdate({ ...volunteer, organization: e.target.value })
              }
              placeholder="Organization name"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Input
              value={volunteer.role}
              onChange={(e) => onUpdate({ ...volunteer, role: e.target.value })}
              placeholder="Volunteer role"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Start Date</Label>
            <Input
              value={volunteer.startDate}
              onChange={(e) =>
                onUpdate({ ...volunteer, startDate: e.target.value })
              }
              placeholder="Jan 2021"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">End Date</Label>
            <Input
              value={volunteer.endDate}
              onChange={(e) =>
                onUpdate({ ...volunteer, endDate: e.target.value })
              }
              placeholder="Dec 2021"
              className="h-8 text-sm"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea
              value={volunteer.description}
              onChange={(e) =>
                onUpdate({ ...volunteer, description: e.target.value })
              }
              placeholder="What did you do?"
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Awards ── */

function AwardItem({
  award,
  onUpdate,
  onDelete,
}: {
  award: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  };
  onUpdate: (a: typeof award) => void;
  onDelete: () => void;
}) {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-start gap-2">
        <GripVertical className="h-5 w-5 text-muted-foreground mt-1 cursor-grab shrink-0" />
        <div className="flex-1 grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label className="text-xs">Award Title</Label>
            <Input
              value={award.title}
              onChange={(e) => onUpdate({ ...award, title: e.target.value })}
              placeholder="Award name"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Issuer</Label>
            <Input
              value={award.issuer}
              onChange={(e) => onUpdate({ ...award, issuer: e.target.value })}
              placeholder="Issuing organization"
              className="h-8 text-sm"
            />
          </div>
          <div>
            <Label className="text-xs">Date</Label>
            <Input
              value={award.date}
              onChange={(e) => onUpdate({ ...award, date: e.target.value })}
              placeholder="2023"
              className="h-8 text-sm"
            />
          </div>
          <div className="col-span-2">
            <Label className="text-xs">Description (optional)</Label>
            <Textarea
              value={award.description || ""}
              onChange={(e) =>
                onUpdate({ ...award, description: e.target.value })
              }
              placeholder="Brief description..."
              rows={2}
              className="text-sm resize-none"
            />
          </div>
        </div>
        <DeleteButton onClick={onDelete} />
      </div>
    </Card>
  );
}

/* ── Interests ── */

function InterestsEditor({
  interests,
  onChange,
}: {
  interests: string[];
  onChange: (interests: string[]) => void;
}) {
  return (
    <TagInput
      tags={interests}
      onChange={onChange}
      placeholder="Add an interest..."
      label="Your interests and hobbies"
    />
  );
}
