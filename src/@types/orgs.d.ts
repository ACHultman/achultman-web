type OrgName = "uvic" | "itc" | "se" | "asm"

type Org = {
  title: string
  href: string
  color: string
  description: string
}

type TimelineItem = {
  icon: React.FC
  org: Org
  subtitle: string
  dateRange: string
}
