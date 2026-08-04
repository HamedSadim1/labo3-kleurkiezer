import React from "react";
import SectionHeader from "./SectionHeader";

interface PanelProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

/** A section with a shared heading — used for every card in the picker. */
const Panel: React.FC<PanelProps> = ({ title, action, children }) => (
  <section>
    <SectionHeader title={title} action={action} />
    {children}
  </section>
);

export default Panel;
