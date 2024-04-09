import { CachedMetadata, TFile } from "obsidian";
import * as fs from 'fs/promises';

type Frontmatter = {
    assigned: string[];
};

export const OnChangeNotification = async (
    file: TFile,
    data: string,
    cache: CachedMetadata,
    url: string) => {

    const { frontmatter } = cache as { frontmatter: Frontmatter };

    const taskname = file.basename;
    const assigned = frontmatter.assigned;

    console.log(assigned);

    if (!assigned) {
        console.log("No assigned user");
        return;
    }

    const cleanTaskname = taskname.replace(/\s/g, '');

    const result = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ taskname: cleanTaskname, assigned})
    });

    if (result.ok) {
        console.log("success")
    }
};
