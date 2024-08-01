import * as React from 'react';
import { Tabs, Tab as MuiTab, Box } from '@mui/material';
import { TabModel } from '../../models/ApiResponse';
//Don't use this. Its incomplete
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                // <Box sx={{ p: 3 }}>
                //<Typography>{children}</Typography>
                // </Box>
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Tab(props: any) {
    const { tabs, selectedIndex, ...other } = props;
    const [value, setValue] = React.useState(selectedIndex);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        {tabs && tabs.map((item: TabModel, index: number) => (
                            <MuiTab key={index} value={index} label={item.Text} {...a11yProps(index)} />
                        ))}
                    </Tabs>
                </Box>
                {tabs && tabs.map((item: TabModel, index: number) => (
                    <TabPanel key={index} value={value} index={index}>
                        {item.Content}
                    </TabPanel>
                ))}
            </Box>
        </>
    );
}

export default Tab


// const [selectedTabIndex, setValue] = React.useState(0);
// const tabs: TabModel[] = [
//   {
//     Text: "Societies",
//     Content: (
//       <Typography> Hellowww</Typography>
//     )
//   },
//   {
//     Text: "Business Associate",
//     Content: (
//       <Typography> Hello</Typography>
//     )
//   }
// ];
{/* <Controls.Tab
selectedIndex={selectedTabIndex}
tabs={tabs}
/> */}